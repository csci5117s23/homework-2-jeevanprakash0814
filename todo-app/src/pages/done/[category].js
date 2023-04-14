import { useRouter } from "next/router";
import TodoFull from "@/components/TodoFull";
import Navbar from "@/components/Navbar";

export default function DoneCategoryPage() {
    const router = useRouter();
    const {category} = router.query;
    const text = "just testing";
    if (text) {
        return <>
            <Navbar />
            <TodoFull id={category} text={text}></TodoFull>
        </>
    } else {
        return <></>
    }
}