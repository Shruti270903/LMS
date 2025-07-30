import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/companies'
import CoursesSection from '../../components/student/coursesSection'
import TestimonialSection from '../../components/student/TestimonialSection'
import CallToAction from '../../components/student/callToAction'
import Footer from '../../components/student/Footer'
import MyEnrollments from './MyEnrollments'
const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
        <Hero/>
        <Companies/>
        <CoursesSection/>
        <TestimonialSection/>
        <CallToAction />
        <Footer/>
        {/* <Loading/> */}
        {/* <MyEnrollments/> */}
    </div>
  )
}

export default Home