import React from 'react'
import Head from 'next/head'
import Navbar from './../components/navbar'
import Footer from './../components/footer'
import './../components/LoadClasses'
import { GetServerSideProps } from 'next'
import { Category, Config } from '../database/models'
import DbConnect from '../utils/dbConnect'
import ReactHtmlParser from 'react-html-parser'

export const getServerSideProps: GetServerSideProps = async () => {
    await DbConnect()
    let { info, categories } = { info: null, categories: null }

    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    try {
        categories = await Category.find({}).exec()
        categories = categories._doc.content
    } catch (e) { }

    return {
        props: {
            info,
            categories: categories?.map(c => { return { color: c?.color, link: c?.link || null, name: c?.name } })
        }

    }
}

const Index = ({ info, categories }) => {

    return (
        <>
            <Head>
                <title>Sobre - {info?.websiteName}</title>
                {ReactHtmlParser(info?.customLayoutStyles)}
            </Head>
            <Navbar info={info} categories={categories} />
            <div className="mx-auto container grid grid-cols-5 pb-4 items-center">
                <div className="col-span-5 lg:col-span-2 px-3 md:px-6 my-8">
                    <h1 className="text-2xl font-semibold text-gray-700 mb-2">Este é o nosso Jornalzinho!</h1>
                    <p className="text-lg text-gray-600 my-6">
                        Pequeno Jornal é uma equipe de jornalistas e colunistas sérios e bem preparados na produção de notícias e artigos sobre vários assuntos, bem como: animes, séries, filmes, jogos, atualidades, tecnologia e afins.
                    </p>
                    <p className="text-lg text-gray-600 my-6">
                        Ele surgiu como um ímpeto para que pudéssemos informar e promover conteúdos criativos e disruptivos, além de nos conectar ainda mais. E sendo desta forma, não se trata apenas de textos e notícias. Nosso jornal não busca somente levar informação e entretenimento para aqueles que se interessam, somos como uma família, construímos relações e interesses em comum.
                    </p>
                    <p className="text-lg text-gray-600 my-6">
                        É um lugar para se expressar, compartilhar conhecimento e fazer amigos.
                    </p>
                </div>
                <div className="col-span-5 lg:col-span-3 my-8">
                    <div className={`mx-4 bg-${info?.colors?.background?.color || "gray-500"}`}>
                        <img className="h-96 p-6 mx-auto hidden md:block" src={info?.icon} alt="" />
                        <img className="w-full p-6 mx-auto block md:hidden" src={info?.icon} alt="" />
                    </div>
                </div>
            </div>
            <Footer info={info} />
        </>
    )


}

export default Index