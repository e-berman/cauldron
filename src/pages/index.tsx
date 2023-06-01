import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

const Home: NextPage = () => {

  const user = useUser();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          {!user.isSignedIn && <SignInButton />}
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          {!!user.isSignedIn && <SignOutButton />}
        </div>
        
      </main>
    </>
  );
};

export default Home;
