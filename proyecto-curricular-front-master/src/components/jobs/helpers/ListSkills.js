import React from 'react'

export const ListSkills = ({skill,skillsActive}) => {

    const handleActive=(e) => {
        if(e.target.classList.contains('active')){
            skillsActive.delete(e.target.textContent);
            e.target.classList.remove('active');
        }else{
            skillsActive.add(e.target.textContent);
            e.target.classList.add('active');
        }
    }
    return (
        <li onClick={handleActive} className={(skillsActive.has(skill))?'active':''}>
            {skill}
        </li>
    )
}
