import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="w-screen mt-[50px] flex justify-center items-center h-[calc(100vh-80px)]">
      <div className="relative w-full h-full">
        <Image
          className="object-cover object-center"
          alt="Landing image"
          src="/images/Landing.jpg"
          fill
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
