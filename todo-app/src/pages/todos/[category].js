import { useRouter } from "next/router";
import TodoFull from "@/components/TodoFull";
import Navbar from "@/components/Navbar";

export default function TodoCategoryPage() {
    const router = useRouter();
    const {category} = router.query;
    const text = "just testing";
    if (text) {
        return <>
            <SignedIn>
                <Navbar />
                <TodoFull id={category} text={text}></TodoFull>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    } else {
        return <></>
    }
}