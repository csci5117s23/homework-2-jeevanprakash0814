import React, { useState, useEffect } from "react";

export default function DoneList() {
    const [loading, setLoading] = useState(false);
    const [doneItems, setDoneItems] = useState([{text: "yuh"}]);


    // setLoading(true);


    if(loading) {
        return <span> loading ... </span> // add nice loading animation here
    } else {
        const doneListItems = doneItems.map((doneItem) => (
            <li key={doneItem.text}>
                {doneItem.text}
            </li>
        ));

        return (
            <>
                <ol className="place-items-center">
                    {doneListItems}
                </ol>
            </>
        );
    }
}