import LayoutProvider from "@/components/LayoutProvider";
import "./globals.css";
import "@/stylesheets/commonClasses.css";
import "@/stylesheets/customClasses.css";
import ReduxStoreProvider from "@/components/ReduxStoreProvider";

export const metadata = {
  title: "Democars Rental App",
  description: "A car rental application",
};

export default function RootLayout({ children }) {
  return (
    <ReduxStoreProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </ReduxStoreProvider>
  );
  // return (
  //   <html lang="en">
  //     <body>{children}</body>
  //   </html>
  // );
}
