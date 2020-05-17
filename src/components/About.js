import React from "react";
import {
    IconButton,
} from "@material-ui/core";
import {
    GitHub,
    LinkedIn
} from "@material-ui/icons";

export default () => {
    return (
        <div className="about-container">
            <div className="about-section-container">
                <div className="about-section-content">
                    <div className="about-title-container1">
                        <h3 className="about-section-header">Covid-19</h3>
                    </div>
                    <div className="about-text-container1">
                        <p className="about-section-text">Coronavirus disease 2019 (COVID-19) is an infectious disease caused by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). It was first identified in December 2019 in Wuhan, China and has since spread globally, resulting in an ongoing pandemic.
                        </p>
                    </div>
                </div>
                <div className="about-section-content">
                    <div className="about-title-container2">
                        <h3 className="about-section-header">Symptoms</h3>
                    </div>
                    <div className="about-text-container2">
                        <p className="about-section-text">Covid-19 can look different for many people. Common symptoms include fever, cough, fatigue, shortness of breath, and loss of smell and taste. While the majority of cases result in mild symptoms, some progress to acute respiratory distress syndrome, multi-organ failure, septic shock, and blood clots. The time from exposure to onset of symptoms range from two to fourteen days. It is important to seek immediate medical assistance if you experience any emergency symptoms.
                        </p>
                    </div>
                </div>
            </div>
            <div className="about-section-container">
                <div className="about-section-content">
                    <div className="about-title-container3">
                        <h3 className="about-section-header">Precautions</h3>
                    </div>
                    <div className="about-text-container3">
                        <p className="about-section-text">There is currently no vaccine for covid-19. Critically infected persons are managed with supportive care. Preventative measures to avoid contracting the disease include proper hygiene, hand washing with soap and water, keeping distance from others, and avoiding touching your eyes, nose, or mouth with unwashed hands. A healthy lifestyle and diet have been recommended to improve immunity.
                        </p>
                    </div>
                </div>
                <div className="about-section-content">
                    <div className="about-title-container4">
                        <h3 className="about-section-header">Transmission</h3>
                    </div>
                    <div className="about-text-container4">
                        <p className="about-section-text">The virus is primarily spread between people during close contact, most often via small droplets produced by coughing, sneezing, or talking. Droplets may persist on surfaces for up to 72 hours, and people have become infected by touching contaminated surfaces and then touching their face without proper hand washing.
                        </p>
                    </div>
                </div>
            </div>
            <div className="about-section-container">
                <div className="about-section-content">
                    <div className="about-title-container5">
                        <h3 className="about-section-header">Risk</h3>
                    </div>
                    <div className="about-text-container5">
                        <p className="about-section-text">Children make up a small proportion of reported cases, about 1% of cases being under 10 years, 4% aged 10-19; They are likely to have milder symptoms and a lower chance of severe disease than adults. Persons over the age of 60 are most at risk and have the highest fatality rates. Most of those who die from covid-19 have pre-existing conditions, or comorbidity. The availibility of medical resources and the socioeconomics of a region may also affect mortality. Because covid-19 is a respiratory disease, smokers are at an increased risk of severe symptoms and likelihood to require intensive care or die compared to non-smokers. 
                        </p>
                    </div>
                </div>
                <div className="about-section-content">
                    <div className="about-title-container6">
                        <h3 className="about-section-header">Testing</h3>
                    </div>
                    <div className="about-text-container6">    
                        <p className="about-section-text">Several testing protocols have been published by the World Health Organization (WHO), with real-time reverse transcription polymerase chain reaction (rRT-PCR) being the standard method. The test is typically done on respiratory samples obtained by a nasal swab. Results are generally available within a few hours to two days.
                        </p>
                    </div>
                </div>
            </div>
            <div className="about-section-container">     
                <div className="about-section-content">
                    <div className="about-title-container7">
                        <h3 className="about-section-header">If You're Sick</h3>
                    </div>
                    <div className="about-text-container7">    
                        <p className="about-section-text">Seek immediate medical help if you are experiencing emergency symptoms. Wear a facemask and exercise good hygiene practices to prevent spreading the virus or contaminating surfaces. Stay home and self-isolate if possible and maintain a distance from others in public.
                        </p>
                    </div>
                </div>
                <div className="about-section-content">
                    <div className="about-title-container8">
                        <h3 className="about-section-header">Contributors</h3>
                    </div>
                    <div className="about-text-container8">
                        <div className="about-contributor">
                            <a href="https://github.com/jmtblei" target="_blank" rel="noopener noreferrer" className="icon-link">
                                <IconButton aria-label="github" color="inherit" className="icon-color">
                                    <GitHub />
                                </IconButton>    
                            </a>
                            <a href="https://www.linkedin.com/in/jmtblei/" target="_blank" rel="noopener noreferrer" className="icon-link">
                                <IconButton aria-label="github" color="inherit" className="icon-color">
                                    <LinkedIn />
                                </IconButton>
                            </a>
                            <p> <b>Benson Lei</b> | Software Engineer
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}