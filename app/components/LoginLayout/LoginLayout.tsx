import "./LoginLayout.css";

type LoginLayoutProps = {
  children: React.ReactNode;
};

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => (
  <div className="main-wrap">
    <div className="logo">Logo Here</div> {/* todo Logo placement */}
    <div className="container">{children}</div>
    <div className="footer">
      <a href="/terms">Terms of use</a> | <a href="/privacy">Privacy policy</a>
    </div>
    {/* todo terms / privacy */}
  </div>
);

export default LoginLayout;
