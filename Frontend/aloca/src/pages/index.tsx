import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Main from "@/components/Main";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
        <Header title={"Página inicial"}/>
        <Main/>
    </main>
  );
}
