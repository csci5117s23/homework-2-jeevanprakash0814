import { useRouter } from "next/router";
import TodoFull from "@/components/TodoFull";

export default function groupPage() {
    const router = useRouter();
    const {id} = router.query;
    const text = "just testing";
    if (text) {
        return <TodoFull id={id} text={text}></TodoFull>
    } else {
        return <></>
    }
}