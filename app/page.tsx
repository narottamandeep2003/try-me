import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="w-[300px] h-[300px] rounded-full overflow-hidden">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={300} 
          height={300} 
        />
      </div>
    </div>
  );
}
