import { useRouter } from "next/router";
import TodoFull from "@/components/TodoFull";
import Navbar from "@/components/Navbar";

export default function todoPage() {
    const router = useRouter();
    const {id} = router.query;
    const text = "just testing";
    if (text) {
        return <>
            <Navbar />
            <TodoFull id={id} text={text}></TodoFull>
        </>
    } else {
        return <></>
    }
}