"use client"
import { Button } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useState } from "react";

const AuthButtons = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className='flex gap-3 flex-1 md:flex-col flex-row  relative z-50'>
      <RegisterLink className="flex-1" onClick={()=> setIsLoading(true)}>
        <Button className="w-full" variant={"outline"}>
          Sign up
        </Button>
      </RegisterLink>

      <LoginLink className="flex-1">
      <Button className="w-full" disabled={isLoading} >Login</Button>
      </LoginLink>
    </div>
  );
};
export default AuthButtons;
