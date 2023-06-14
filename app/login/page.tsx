//indicates this file should be in the client side
"use client";

import axios from "axios";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/components/input/Input";
import Link from "next/link";

// types of the variables
interface InitialStateProps {
  name: string;
  email: string;
  password: string;
}

//default state. Uses interface for type assignment
const initialState: InitialStateProps = {
  name: "",
  email: "",
  password: "",
};

export default function page() {
  //used to redirect to another path
  const router = useRouter();
  //variable state container
  const [state, setState] = useState(initialState);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      // Signs the user using next-auth function "signIn()"
      const result = await signIn("credentials", {
        ...state,
        redirect: false,
      });

      if (result?.ok) {
        // Redirect the user to the root path ("/")
        router.push("/");
      } else {
        throw new Error("Wrong Credentials");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //sets the state with the data from the form
  function handleChange(event: any) {
    //spreads the state like this:
    // name: "sampleName",
    // email: "sampleEmail",
    // password: "samplePassword"
    // gets the name and value, spreads it, the set it in the state
    setState({ ...state, [event.target.name]: event.target.value });
    console.log(event.target.value);
  }

  return (
    <form onSubmit={onSubmit} className="text-center">
      <div className="flex flex-col justify-center h-[450px] w-[350px] mx-auto gap-2">
        <Input
          placeholder="Email"
          id="email"
          type="email"
          name="email"
          onChange={handleChange}
          value={state.email}
        />
        <Input
          placeholder="Password"
          id="password"
          type="password"
          name="password"
          onChange={handleChange}
          value={state.password}
        />
        <button type="submit">Submit</button>
      </div>

      <div>
        <div>
          Haven't got an account ? <Link href="/register">Sign up</Link>
        </div>
      </div>
    </form>
  );
}
