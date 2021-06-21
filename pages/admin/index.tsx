import React from 'react'
import { GetServerSideProps } from 'next'
import { AdminAuth } from '../../utils/authentication'
import { Config } from '../../database/models'
import DbConnect from './../../utils/dbConnect'
import LayoutAdminArea from '../../layout/layoutAdmin'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return AdminAuth({ req, res }, async ({ user }) => {
        await DbConnect()

        let info = null
        try {
            info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
            info = info._doc.content
        } catch (e) { }

        return {
            props: {
                info,
                user
            }
        }
    })
}

const Index = ({ info, user }) => {

    return (
        <>
            <LayoutAdminArea head={<title>Página Inicial</title>} info={info} user={user}>

            </LayoutAdminArea>
        </>
    )


}

export default Index