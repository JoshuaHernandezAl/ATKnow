import React from 'react'

export const Pagination = ({range,setRange,next}) => {
    const handleAdd=()=>{
        setRange({
            ...range,
            from:range.limit,
            limit:range.limit+5,
        });
        window.scroll(0,0);
    }
    const handleSubs=()=>{
        setRange({
            ...range,
            from:range.from-5,
            limit:range.from,
        });
        window.scroll(0,0);
    }
    // console.log(next);
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination pagination-lg justify-content-center mt-4">
                {
                    (range.from!==0)?(
                        <li className="page-item btn btn-outline-primary fs-1 px-3" onClick={handleSubs}>
                            <span aria-hidden="true">&laquo;</span>
                        </li>
                    ):''
                }
                {
                    (!next)?'':(
                        <li className="page-item btn btn-primary fs-1 px-3" onClick={handleAdd}>
                            <span aria-hidden="true">&raquo;</span>
                        </li>
                    )
                }
            </ul>
        </nav>
    )
}
