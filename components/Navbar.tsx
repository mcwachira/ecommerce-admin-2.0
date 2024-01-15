import { UserButton, auth } from "@clerk/nextjs";
import React from "react";
import MainNav from "./Main-Nav";
import { StoreSwitcher } from "./Store-Switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import {ThemeToggle} from "@/components/ThemeToggle";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items0-center space-x-4">
          <ThemeToggle/>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
