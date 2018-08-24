export { ClassUI } from "classui/ClassUI";
export { NavBar, NavbarRemain } from "classui/Navbar";
export { Content } from "classui//Content";

// Import Material font to head tag here itself!
const link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";

document.head.appendChild(link);
