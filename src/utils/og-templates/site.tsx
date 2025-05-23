import { SITE } from "@config";

export default () => {
  return (
<div
  style={{
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#fff',
    fontSize: 60,
    letterSpacing: -2,
    fontWeight: 700,
    textAlign: 'center',
  }}
  >
    <img
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          marginRight: "8px",
        }}
        src="https://bucket.liruifengv.com/avatar.jpg"
      ></img>
      <div
        style={{
          color: '#000',
        }}
      >
        liruifengv.com
      </div>
      <div
        style={{
          color: '#000',
          marginTop:"32px",
          fontSize: "32px"
        }}
      >
        Web 开发者，开源爱好者。
      </div>
</div>

  );
};
