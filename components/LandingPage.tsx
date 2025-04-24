import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="w-screen mt-[50px] flex justify-center items-center h-[calc(100vh-80px)]">
      <div className="relative w-full h-full flex justify-center items-center">
        <Image
          className="object-cover object-center max-md:hidden"
          alt="Landing image"
          src="/images/Landing.jpg"
          fill
          quality={60}
          priority={true}
        />
        <Image
          className="object-cover object-center w-[calc(100%-50px)] md:hidden"
          alt="Landing image"
          src="/images/Landing1.jpg"
          fill
          quality={60}
          priority={true}
        />
      </div>
    </div>
  );
}
