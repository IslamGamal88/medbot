import Image from "next/image";
import Link from "next/link";
import { images } from "@/resources/images";

export default function Home() {
  return (
    <main className="h-full  bg-red-100">
      <div className="w-3/4 m-auto h-full flex flex-col justify-evenly">
        <h1 className="text-7xl text-center">Pronation</h1>
        <div className="grid grid-cols-4 gap-4 ">
          {Object.values(images).map((image) => (
            <div key={image.src} className="relative h-60 w-full">
              <Image
                className="w-full h-full"
                src={image}
                alt={`${image}`}
              />
            </div>
          ))}
        </div>
        <Link
          href={"/bot"}
          className="self-center w-fit px-4 py-2 bg-blue-300 text-slate-700 rounded"
        >
          Start
        </Link>
      </div>
    </main>
  );
}
