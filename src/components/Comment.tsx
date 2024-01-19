// @ts-nocheck
import * as React from 'react';
import Giscus from '@giscus/react';

const id = 'inject-comments';

const Comments = () => {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState("light");

  const handleThemeChange = ({detail: { themeValue }}) => {
    const theme = themeValue ?? "light";
    setTheme(theme);
  };

  React.useEffect(() => {
    setTheme(window.localStorage.getItem('theme') || 'light');
    window.addEventListener('theme-change', handleThemeChange);

    return () => {
      window.removeEventListener('theme-changes', handleThemeChange);
    };
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div id={id}>
      {mounted ? (
        <Giscus
          id={id}
          repo="liruifengv/liruifengv.com"
          repoId="R_kgDOKeudTw"
          category="Announcements"
          categoryId="DIC_kwDOKeudT84Cch4W"
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          lang="zh-CN"
          loading="lazy"
          theme={theme}
        />
      ) : null}
    </div>
  );
};

export default Comments;