type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-500">
      {children}
    </div>
  );
};

export default AuthLayout;
