import React from 'react';
import './footer.css';

export default function Footer(props){

    return <section id="footer-section" className={/*!props.logged?'footer-unlogged':''*/''}>

        <p id="footer-text">Developed by Herbert Hipólito</p>

    </section>

}