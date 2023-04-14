import Link from "next/link"
import { useAuth, UserButton, SignIn } from '@clerk/nextjs';

export default function Navbar({ Component, pageProps }) {
    const { isLoaded, userId, sessionId, getToken } = useAuth();

    if(!isLoaded) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
        return <>
            <nav className="navbar navbar-expand-lg navbar-light bg-dark">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-mdb-toggle="collapse"
                        data-mdb-target="#navbarCenteredExample"
                        aria-controls="navbarCenteredExample"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="navbar-collapse justify-content-center">
                        <Link className="navbar-brand text-white m-2" href="/">To-Do</Link>
                    </div>
                    <div className="navbar-collapse justify-content-right">
                        <UserButton />
                    </div>
                    {/* <div className="collapse navbar-collapse">
                    </div> */}
                </div>
            </nav>
        </>
    }
}