"use client";
import React, { memo, useState, useCallback, useEffect } from "react";
import Icon from "./ui/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
	{
		pathname: "Home",
		route: "/",
		icon: "https://cdn.lordicon.com/xzalkbkz.json",
	},
	{
		pathname: "Days & Time",
		route: "/days",
		icon: "https://cdn.lordicon.com/qvyppzqz.json",
	},
	{
		pathname: "Batches",
		route: "/manageBatch",
		icon: "https://cdn.lordicon.com/zrkkrrpl.json",
	},
	{
		pathname: "Attendence",
		route: "/attendence",
		icon: "https://cdn.lordicon.com/ozmbktct.json",
	},
	{
		pathname: "Payment",
		route: "/payment",
		icon: "https://cdn.lordicon.com/wyqtxzeh.json",
		secondaryColor: "#00ADB5",
	},
	{
		pathname: "Assignment",
		route: "/assignment",
		icon: "https://cdn.lordicon.com/ghhwiltn.json",
	},
	{
		pathname: "Result",
		route: "/result",
		icon: "https://cdn.lordicon.com/abwrkdvl.json",
	},
];
function Navbar() {
	const pathname = usePathname();

	const [show, setShow] = useState<boolean>(false);
	const showNavFunc = useCallback((e: MouseEvent) => {
		if ((e.target as HTMLElement).id !== "show-nav-icon") {
			setShow(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("click", showNavFunc);
		return () => {
			document.removeEventListener("click", showNavFunc);
		};
	}, [showNavFunc]);
	return (
		<>
			<i
				className="pi pi-angle-right bg-[#00ADB5] opacity-70 hover:opacity-100 rounded-full p-2 mb-3 absolute z-50 top-2 left-2 block sm:hidden"
				id="show-nav-icon"
				onClick={() => setShow(true)}
			></i>
			<nav
				className={`w-32 fixed h-screen top-0 left-0 ${
					!show ? "-translate-x-full" : "-translate-x-0"
				} transition-all sm:-translate-x-0 sm:relative flex items-center justify-center md:w-56 z-50 bg-[#00ADB5] rounded-r-3xl sm:bg-transparent sm:z-0 shadow-lg shadow-black sm:shadow-none`}
			>
				<i
					className="absolute pi pi-times top-3 right-5 sm:hidden"
					onClick={() => setShow(false)}
				></i>
				<ul className="w-full p-2">
					{links.map((link) => (
						<li
							className={` w-full my-2 transition-all hover:bg-[#08D9D6]/50 ${
								pathname === link.route ? "bg-[#08D9D6]/70 shadow-slate-900 shadow" : ""
							}  rounded-md`}
							key={link.pathname}
						>
							<Link
								href={link.route}
								className={`flex items-center flex-col md:flex-row md:gap-4 py-2 p-1`}
							>
								<Icon
									src={link.icon}
									secondaryColor={link.secondaryColor || null}
								/>
								<h2 className=" leading-none text-sm md:text-base text-center capitalize">
									{link.pathname}
								</h2>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}

export default memo(Navbar);
