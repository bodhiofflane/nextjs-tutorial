import GoogleButton from "@/components/GoggleButton";
import SignInForm from "@/components/SignInForm";

const Signin = () => {
  return (
    <div className="stack">
      <h1>SignIn</h1>
      <GoogleButton />
      <p>or</p>
      <SignInForm />
    </div>
  );
};

export default Signin;
