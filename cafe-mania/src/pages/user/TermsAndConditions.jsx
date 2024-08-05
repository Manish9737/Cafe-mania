import React from 'react'
import TermsData from '../../Data/Terms'

const TermsAndConditions = () => {
    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <h1 className="mb-4 text-center">Terms and Conditions</h1>
                        {TermsData.terms.map((term, index) => (
                            <div className="card mb-3 shadow">
                                <h4 className="card-header bg-primary text-white">{term.title}</h4>
                                <div className="card-body">
                                    <p className="card-text">{term.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TermsAndConditions
