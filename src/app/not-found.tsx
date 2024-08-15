import Image from "next/image";
import Link from "next/link";

export default async function NotFound() {
	return (
		<>
			<div className="h-full w-full flex items-center rounded-l-[44px] rounded-lg">
				<div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
					<div className="w-full lg:w-1/2 mx-8">
						<div className="text-7xl text-emerald-500 font-dark font-extrabold mb-8">
							{" "}
							404
						</div>
						<p className="text-2xl md:text-3xl font-light text-zinc-300 leading-normal mb-8">
							Sorry we couldn&apos;t find the page you&apos;re looking for
						</p>

						<Link
							href="/"
							className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white transition-all duration-400 border border-transparent rounded-lg focus:outline-none bg-emerald-600 active:scale-x-75 hover:bg-emerald-700"
						>
							Back to homepage
						</Link>
					</div>
					<div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
						<Image
							src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
							className="w-full object-contain"
							alt="Page not found"
							width={100}
							height={100}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
