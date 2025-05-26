import { useEffect } from "react";
import { Navbar } from "./elements/Navbar";
import { Footer } from "./elements/Footer";

interface LayoutProps {
	title: string;
	children: React.ReactNode;
}

export const Layout = ({title, children }: LayoutProps) => {

	useEffect(() => {
		document.title = title;
	}, [title])
	return (
		<>
			<Navbar />
				<main className ="flex flex-col gap-y20 md:gap-y32 overflow-hidden">{children}</main>
			<Footer />
		</>
	);
};
