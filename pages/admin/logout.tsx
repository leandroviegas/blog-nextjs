import React from 'react'
import Cookies from 'cookies'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const cookies = new Cookies(req, res)
    cookies.set('adminAuth')

    return {
        redirect: {
            destination: '/admin/signin',
            permanent: false,
        }
    }
}

const Index = () => {

    return (
        <>
        </>
    )


}

export default Index