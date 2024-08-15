import React, { useRef, useState,useEffect } from "react";
interface HeaderInterface {
	title: string;
	children: React.ReactNode;
}
function Header({ title, children }: HeaderInterface) {
	const [nav, setnav] = useState<boolean>(false);
	useEffect(() => {
        // Define the handler for window resize
        const handleResize = () => {
            setnav(false);
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
	return (
		<header className="flex items-center justify-between border-b border-slate-400/60 px-6 h-14 z-10 relative">
			<h2 className="text-2xl xl:text-3xl font-semibold">{title}</h2>
			<i
				className="pi pi-align-justify lg:hidden active:scale-x-90"
				onClick={() => setnav(true)}
			></i>
			<div
				className={`fixed lg:static lg:w-fit h-full lg:h-fit right-0 top-0 bg-zinc-900/30 lg:bg-transparent z-50 min-w-64 p-3 sm:p-5 lg:p-0 rounded-l-3xl ${
					nav
						? "translate-x-0 lg:transform-none shadow-zinc-800 shadow-2xl backdrop-blur-lg"
						: "translate-x-full"
				} transition-transform ease-out lg:shadow-none lg:transform-none`}
			>
				<i
					className="pi pi-times mt-2 mb-6 border p-2 rounded-md lg:hidden active:scale-90 transition-all"
					onClick={() => setnav(false)}
				></i>
				<div className="flex flex-col lg:flex-row justify-end gap-3">
					{children}
				</div>
			</div>
		</header>
	);
}

export default Header;
