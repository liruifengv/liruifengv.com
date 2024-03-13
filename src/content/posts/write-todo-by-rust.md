---
title: "Rust 实战教程之用 Rust 写一个命令行 TODO List（一）"
description: "本教程将带你手把手用 Rust 实现一个命令行的 TODO List。"
pubDatetime: 2023-09-06
author: liruifengv
featured: false
draft: false
tags:
  - Rust
---

## 前言

都说 Rust 学起来比较难，学习曲线陡峭，我也是从入门到放弃了多次才逐渐上手，找到一点感觉。

我觉得一方面是因为最近 Rust 在前端基建领域很火，很多像我一样从 JS 这样的脚本语言入门的程序员，对于底层语言缺乏认知和底层思维。

另一方面是，Rust 的语法太多，很多小伙伴看完语法之后不知道做什么项目实战，过了一段时间又忘了，导致多次从入门到放弃。

所以我边学边写，打算写一系列的 Rust 实战教程，希望能对想入门 Rust 的同学起到帮助。

本次第一个系列是用 Rust 做一个命令行的 TODO List。

后续可能系列：

- Rust 和 actix 开发服务端
- Rust 写一个 Markdown parser
- Rust 开发 WebAssembly
- 等等

## 前置知识

本系列教程属于实战教程，不会教基础语法，虽然过程中也会稍微带一点点。所以希望你在开始之前，已经有了 Rust 的基础语法知识。

对于基础语法，我推荐你看一下 Rust 官方写的 [《Rust Book》[1]](https://doc.rust-lang.org/book/)。

同时，推荐边看边刷 [rustlings[2]](https://github.com/rust-lang/rustlings)。

这样基本对于 Rust 的基础语法就有了一定的了解。

## 项目搭建

### 先看要实现的最终效果

![最终效果图](https://bucket.liruifengv.com/Rust/p2.png)

我们给这个 cli 起名叫 `rodo`，它拥有几个命令，分别是：

- `rodo add [content]`：添加一个 todo
- `rodo list`：列出所有的 todo
- `rodo remove [id]`：删除一个 todo
- `rodo info`：显示 rodo 的信息

以及通用的显示版本号和帮助信息的命令。

### 仓库地址

这个项目的代码我已经上传到 GitHub，欢迎大家 star 和 fork。

[todo-rs 仓库地址[3]](https://github.com/liruifengv/todo-rs)

### 项目初始化

使用如下命令创建项目：

```bash
cargo new todo-rs
```

![初始化项目](https://bucket.liruifengv.com/Rust/p1.png)

新建出来的项目目录结构如上图。执行 `cargo run` 会输出 `Hello, world!`。

```bash
cargo run
   Compiling todo-rs2 v0.1.0 (D:\mime\todo-rs2)
    Finished dev [unoptimized + debuginfo] target(s) in 0.58s
     Running `target\debug\todo-rs2.exe`
Hello, world!
```

## 开始实战

### 获取命令行参数

第一步，我们先获取命令行参数，这里我们使用标准库中的 `env::args()` 方法获取命令行参数。

```rs
use std::env;

fn main() {
    // 获取命令行参数
    let args: Vec<String> = env::args().collect();
    // 如果没有参数，输出提示信息
    if args.len() < 2 {
        println!("Usage: rodo [add|rm|ls] [args]");
        return;
    }
}
```

接下来，我们要对不同的命令做不同的处理，这里我们使用 `match` 语法。
添加如下代码：

```rs
    let command = &args[1];

    match command.as_str() {
        "add" => {
            if args.len() < 3 {
                println!("Usage: rodo add [contents]");
                return;
            }
            println!("Add");
        }
        "rm" => {
            if args.len() < 3 {
                println!("Usage: rodo rm [id]");
                return;
            }
            println!("Remove");
        }
        "ls" => {
            println!("List");
        }
        _ => {
            println!("Unknown command: {}", command);
        }
    }
```

执行 `cargo run`，这里我们对不同的命令做了不同的处理，如果参数数量不对，会输出提示信息。

```console
$ cargo run
Usage: rodo [add|rm|ls] [args]
$ cargo run add
Usage: rodo add [contents]
$ cargo run add test
Add
$ cargo run ls
List
$ cargo run rm
Usage: rodo rm [id]
$ cargo run rm 1
Remove
$ cargo run test
Unknown command: test
```

### 实现 todo 数据存储

既然是 todo list，那么数据需要有地方存储。这里我们写一个超简易的数据库，实际就是个文本文件，每一行是一个 todo，由 id 和内容组成，用逗号分隔。

```js
1, test;
2, test2;
```

新建一个 `database.rs` 文件。

先创建一个 `Record` 结构体，用来表示一条数据记录。

```rs
pub struct Record {
    pub id: i32,
    pub content: String,
}
```

再创建一个 `Database` 结构体，用来表示整个数据库，它有一个 file 属性。

为 Database 实现一个 open 方法，参数接受一个文件名，返回一个 Database 实例

```rs
use std::fs::{File, OpenOptions};

pub struct Database {
    pub file: File,
}

// 为 Database 实现一个 open 方法，参数接受一个文件名，返回一个 Database 实例
impl Database {
    // 打开数据库文件
    pub fn open(filename: &str) -> Database {
        let file = OpenOptions::new()
            .create(true)
            .read(true)
            .write(true)
            .open(filename)
            .unwrap();
        Database { file }
    }
}
```

#### 实现添加方法

先为 Database 实现一个 `add_record` 方法，用来添加一条记录。

此方法接受一个 `Record` 类型的参数，将其写入到文件中，使用 `format!` 宏将 `Record` 拼接成字符串，使用 `writeln!` 宏将字符串写入到文件中。

```rs
// writeln! 宏需要使用 use std::io::Write 导入
use std::io::Write;

impl Database {
    pub fn add_record(&mut self, record: &Record) {
        let line = format!("{},{}\n", record.id, record.content);
        writeln!(self.file, "{}", line).unwrap();
        println!("📝 Item added: {}", record.content);
    }
}
```

然后我们回到 `main.rs`。

首先导入 `database` 模块，然后在 `main` 函数中创建一个 `Database` 实例。

使用 `Database::open(".rododb")` 创建了一个 `Database` 实例，它会打开一个名为 `.rododb` 的文件，如果文件不存在，会自动创建。

请注意，此时创建的文件是在项目根目录下，你会在项目根目录下看到一个 `.rododb` 文件。后续我们会更新文件的存储位置。

```rs
mod database;

use database::Database;

fn main() {
    let args: Vec<String> = env::args().collect();

    let command = &args[1];
    let mut db = Database::open(".rodorc");

    match command.as_str() {
        "add" => {
            if args.len() < 3 {
                println!("Usage: rodo add [contents]");
                return;
            }
            let contents = &args[2..].join(" ");
            let id = 1;
            db.add_record(&database::Record {
                id,
                content: contents.to_string(),
            });
        }
        // 其他省略
    }
}
```

以上代码，当我们执行 `cargo run add test` 时，会调用 `db` 实例的 `add_record` 方法，将 `Record` 写入到 `.rododb` 文件中。

```console
$ cargo run add test
📝 Item added: test
```

同时会在 `.rododb` 文件中看到一条记录。

```js
1, test;
```

#### 实现列表方法

注意上面添加记录时，我写死了 id 为 1，实际上我们需要根据文件中已有 id 进行自增。

接下来我们实现列表方法，用来列出所有的 todo 并返回，并获取最大的 id。

回到 `database.rs`。我们要实现一个读取文件的方法，将文件中的内容读取出来，而我们的数据字符串形式以行存储的，所以我们需要将每一行解析成 `Record`。

这里实现一个 `parse_record_line` 方法，接受一个字符串，返回一个 `Record`。

```rs
// 解析记录行
pub fn parse_record_line(line: &str) -> Record {
  let fields: Vec<&str> = line.split(',').collect();
  // 处理空行的情况
  if fields.len() == 1 {
      return Record {
          id: 0,
          content: "".to_string(),
      };
  }
  let content = fields[1..].join(",");
  Record {
      id: fields[0].parse::<i32>().unwrap(),
      content,
  }
}

```

然后为 `Database` 实现一个 `read_records` 方法，用来读取文件中的所有记录，并返回一个 `Vec<Record>`。

```rs
// 我们使用 std::io 中的 BufReader 来读取文件
use std::io::{BufRead, BufReader, Write};

impl Database {
    pub fn read_records(&mut self) -> Vec<Record> {
        let reader = BufReader::new(&self.file);
        reader
            .lines()
            .map_while(Result::ok)
            .filter(|line| !line.is_empty())
            .map(|line| parse_record_line(&line))
            .collect()
    }
}
```

继续回到 `main.rs`，调用我们刚刚实现的 `read_records` 方法，循环返回的 Vec 并打印输出。

```rs
    match command.as_str() {
        // 省略
        "ls" => {
            let records = db.read_records();
            if records.is_empty() {
                println!("No records. You can add one with `rodo add [content]`");
                return;
            }
            for record in records {
                println!(" ⬜️ {}: {}", record.id, record.content);
            }
        }
        // 省略
    }
```

```console
$ cargo run ls
 ⬜️ 1: test
```

OK! 没问题。

优化一下之前的添加逻辑：

```rs
  let id = db.read_records().last().map(|r| r.id + 1).unwrap_or(1);
```

Ok，这样就可以自增 id 了。

#### 实现删除方法

接下来我们实现删除方法，删除方法接受一个 id，删除对应的 todo。

回到 `database.rs`，为 `Database` 实现一个 `remove_record` 方法。

```rs
pub fn remove_record(&mut self, id: i32) {}
```

接下来根据参数 id 读取文件找到对应的行：

```rs
pub fn remove_record(&mut self, id: i32) {
    // 使用 BufReader 读取文件
    let reader = BufReader::new(&self.file);
    let mut lines = reader.lines().enumerate();
    // 根据 id 找出对应的行
    let line = lines.find(|(_, line)| {
        let record = parse_record_line(line.as_ref().unwrap());
        record.id == id
    });
}
```

然后要做的操作就是，在源文件中删除这一行，然后将剩余的行写入到源文件中。

```rs
  use std::io::{BufRead, BufReader, Seek, Write};

    // 删除记录
  pub fn remove_record(&mut self, id: i32) {
      let reader = BufReader::new(&self.file);
      let mut lines = reader.lines().enumerate();
      let line = lines.find(|(_, line)| {
          let record = parse_record_line(line.as_ref().unwrap());
          record.id == id
      });
      // match 匹配判断该行是否存在
      match line {
          Some((i, _)) => {
              // 读取源文件内容
              let contents = fs::read_to_string(".rododb").unwrap();
              // 过滤掉对应的行，这里使用的对应 api 可以查看 Rust 标准库
              let new_contents = contents
                  .lines()
                  .enumerate()
                  .filter(|(j, _)| *j != i)
                  .map(|(_, line)| line)
                  .collect::<Vec<_>>()
                  .join("\n");
              // 将新的内容写入到源文件中
              // 这里使用了 std::io::Seek，需要导入
              self.file.seek(std::io::SeekFrom::Start(0)).unwrap();
              self.file.write_all(new_contents.as_bytes()).unwrap();
              self.file.set_len(new_contents.len() as u64).unwrap();

              println!(" ❌ Item removed!\n");
          }
          None => {
              println!("No such record: {}", id);
          }
      }
  }
```

回到 `main.rs`，调用 `remove_record` 方法。

```rs
    match command.as_str() {
        // 省略
        "rm" => {
            if args.len() < 3 {
                println!("Usage: rodo rm [id]");
                return;
            }
            // 这里 id 是字符串，需要转换成 i32
            let id = args[2].parse::<i32>().unwrap();
            db.remove_record(id);
        }
        // 省略
    }
```

我们来测试一下：

```console
$ cargo run add test
 📝 Item added: test
$ cargo run ls
 ⬜️ 1: test
$ cargo run rm 1
❌ Item removed!
$ cargo run ls
No records. You can add one with `rodo add [content]`
```

OK，没问题，删除成功。

## 小结

到这里，我们实现了 todo list 的基本功能，但是还有很多可以优化的地方，比如：

- 使用 `clap` 优化 CLI 的处理和交互
- 优化代码结构和错误处理
- db 文件现在存储在项目根目录，应该存储在用户目录下

由于篇幅有限，这些问题我们都将在下一篇文章中进行优化。

这个项目的代码我已经上传到 GitHub，本节内容在 `part-1` 分支，欢迎大家 star 和 fork，也可以贡献代码，对于本篇文章有任何疑问，欢迎在 GitHub 上提 issue。有错误的地方，欢迎指正。

- [todo-rs 仓库地址](https://github.com/liruifengv/todo-rs)

- [todo-rs part-1](https://github.com/liruifengv/todo-rs/tree/part-1)
