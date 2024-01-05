import React, {useEffect} from 'react';
import "./assets/css/style.css";
import "./assets/js/main.js";
import { BiAtom, BiWorld } from "react-icons/bi";
import {HiCode} from 'react-icons/hi'
import { HiLanguage} from 'react-icons/hi2';

function Home() {

  const [navItemActive, setNavItemActive] = React.useState('Home');
  const [isLoading, setIsLoading] = React.useState(true);


  useEffect(() => {
    setIsLoading(false);
  }, [])

  return (
    <>
    <header id="header" className="fixed-top d-flex align-items-center header-transparent">
    <div style={{backgroundColor: 'rgba(54, 137, 206, .91)', overflowY: 'clip'}} className="container d-flex align-items-center justify-content-between">

      <div className="logo">
        
        <h1><a href="/"><span>Gibber</span></a></h1>
      </div>

      <nav id="navbar" className="navbar">
        <ul>
          <li><a className={"nav-link scrollto " + (navItemActive === "Home" ? 'active': '')} onClick={() => setNavItemActive("Home")} href="#hero">Home</a></li>
          <li><a className={"nav-link scrollto "+ (navItemActive === "About" ? 'active': '')} onClick={() => setNavItemActive("About")} href="#about">About</a></li>
          <li><a className={"nav-link scrollto " + (navItemActive === "Features" ? 'active': '')} onClick={() => setNavItemActive("Features")} href="#features">Features</a></li>
        </ul>
        {/* {
          isMenuClicked === true ? 
          <i className=" bi mobile-nav-toggle bi-x" onClick={() => handleMenuIcon()} ><GrClose /> </i> :
          <i className=" bi mobile-nav-toggle bi-list"  onClick={() => handleMenuIcon()}><HiMenu /></i>
        } */}
        

      </nav>

    </div>
  </header>

  <section id="hero">

    <div style={{backgroundColor: 'rgba(54, 137, 206, .91)'}} className="container">

      <div className="row justify-content-between">
        <div className="col-lg-7 pt-5 pt-lg-0 order-2 order-lg-1 d-flex align-items-center">
          <div >

            <h1>Don't Gibber <span>Communicate</span></h1>
            <h2>Chat in your own language.</h2>
            <div className="text-center text-lg-start">
              <a href="/app/login" className="btn-get-started scrollto">Get Started</a>
            </div>
          </div>
        </div>
        <div className="col-lg-4 order-1 order-lg-2 hero-img"  >
          <img src="assets/img/6.5-inch Screenshot 3.png" className="img-fluid animated" alt="" />
        </div>
      </div>
    </div>

    <svg className="hero-waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28 " preserveAspectRatio="none">
      <defs>
        <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </defs>
      <g className="wave1">
        <use xlinkHref="#wave-path" x="50" y="3" fill="rgba(255,255,255, .1)" />
      </g>
      <g className="wave2">
        <use xlinkHref="#wave-path" x="50" y="0" fill="rgba(255,255,255, .2)" />
      </g>
      <g className="wave3">
        <use xlinkHref="#wave-path" x="50" y="9" fill="#fff" />
      </g>
    </svg>

  </section>

  <main id="main">

    <section id="about" className="about">
      <div className="container-fluid">

        <div style={{marginTop: 30}} className="row">
         
          <div className="col-xl-7 col-lg-6 icon-boxes d-flex flex-column align-items-stretch justify-content-center py-5 px-lg-5" >
            <h3>Our Mission:</h3>
            <p>Communication is hard. In a world where communication drives families, relationships, business, and more, gibber's mission is to simplify communication between parties. Here is why Gibber is different:</p>

            <div className="icon-box" >
              <div className="icon"><BiAtom className='i'/></div>
              <h4 className="title"><a>Translation</a></h4>
              <p className="description">We provide a native experience for you. When you sign up you select your most comfortable language. We take your whole conversation and translate it in the cloud to the other person's profile language.</p>
            </div>

            <div className="icon-box" >
              <div className="icon"><BiAtom className='i'/></div>
              <h4 className="title"><a>Translating your own chat page</a></h4>
              <p className="description">If you've set your profile to korean and don't have a keyboard, don't worry. We'll translate your chat too.</p>
            </div>

            <div className="icon-box"  >
              <div className="icon"><BiAtom className='i'/></div>
              <h4 className="title"><a>Comfort</a></h4>
              <p className="description">By catering to 'your own language' we are allowing you to connect with your loved ones from around the world in whatever language they feel comfortable.</p>
            </div>

          </div>
        </div>

      </div>
    </section>

    <section id="features" className="features">
      <div className="container">

        <div className="section-title" >
          <h2></h2>
          <p>Some Stats</p>
        </div>

    <section id="counts" className="counts">
      <div style={{backgroundColor: 'transparent'}} className="container">
        <div className="row" >
          <div className="col-lg-3 col-md-6">
            <div className="count-box">
              <HiLanguage className="i" />
              <span >20</span>
              <p>Languages</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-5 mt-md-0">
            <div className="count-box">
            <BiWorld className="i" />
              <span >10</span>
              <p>Countries</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-5 mt-lg-0">
            <div className="count-box">
            <HiCode className="i" />
              <span >5</span>
              <p>Developers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
          </div>
    </section>
    <section id="pricing" className="pricing">
      <div className="container">
        <div className="section-title" >
          <h2>Cost</h2>
          <p>How much is this going to cost me?</p>
        </div>
        <div className="row" >
          <div className="col-lg-3 col-md-6">
            <div className="box">
              <h3>Free</h3>
              <h4><sup>$</sup>0<span> / month</span></h4>
              <ul>
                <li>Unlimited Messages</li>
                <li>Any Language you want</li>
              </ul>
            </div>
          </div>
          </div>
    <section id="faq" className="faq section-bg">
      <div style={{backgroundColor: 'transparent'}} className="container">
        <div className="section-title" >
          <h2>F.A.Q</h2>
          <p>Frequently Asked Questions</p>
        </div>

        <div className="faq-list">
          <ul>
            <li >
              <a style={{color: '#1acc8d', textDecoration: 'none'}} data-bs-toggle="collapse" className="collapse" data-bs-target="#faq-list-1">How many languages do you support? <i className="bx bx-chevron-down icon-show"></i><i className="bx bx-chevron-up icon-close"></i></a>
              <div id="faq-list-1" className="collapse show" data-bs-parent=".faq-list">
                <p>
                  We currently support 20+ languages.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>      
        </div>
      </section>
  </main>
  {isLoading ? <div id="preloader"></div> : false}

  </>
  )
}
export default Home;
