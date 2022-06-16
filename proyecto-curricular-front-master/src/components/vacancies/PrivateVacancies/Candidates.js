import React from 'react';
import { useSelector } from 'react-redux';
import '../styles.css';
import { Candidate } from './Candidate';

export const Candidates = () => {
    const {vacancieActive} = useSelector(state => state.vacancies);
    const {candidates} = vacancieActive;
    return (
        <ul className="skills">
            {
                (!candidates)?'':
                (
                    candidates.map((candidate)=>(
                        <Candidate key={candidate._id} candidate={candidate}/>
                    ))
                )
            }
        </ul>
    )
}
