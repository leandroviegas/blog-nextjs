import React, { useEffect, useState } from 'react'
import Cookies from 'cookies'
import Api from './../../../services/api'
import LayoutAdmin from './../../../layout/layoutAdmin'
import { PostCardAdmin, Navigation, SearchBar } from '../../../components'
import { GetServerSideProps } from 'next'
import HandleAuth from '../../../services/auth'
import { Category, CategoryI, Config, ConfigI, User, UserI } from '../../../database/models'
import DbConnect from './../../../utils/dbConnect'
import { Document } from 'mongoose'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()

    const cookies = new Cookies(req, res)

    let user = await HandleAuth(cookies.get("auth") || "na")

    if (user?.username) {

        let info: ConfigI & Document<any, any> = null
        try {
            info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        } catch (e) { }


        let categories: (CategoryI & Document<any, any>)[] = null
        try {
            categories = await Category.find({}).select(`name -_id`).exec()
        } catch (e) { }


        let authors = null
        try {
            authors = [{ username: user.toJSON()?.username, link: user.toJSON()?.link || null }]
        } catch (e) { }

        return {
            props: {
                info: info.toJSON().content,
                user: { username: user.username },
                authors: authors,
                categories: categories?.map(category => category.toJSON())
            }
        }
    } else {
        cookies.get("set")
        return {
            redirect: {
                destination: '/admin/signin',
                permanent: false,
            }
        }
    }
}

const Index = ({ info, user, authors, categories }) => {
    const [posts, setPosts] = useState<{ title: string, description: string, image: string, link: string }[]>()

    const [filters, setFilters] = useState<{ perPage: number, page: number, pages: number, search: string, category: string, author: string }>({ search: "", page: 1, pages: 0, category: "", author: "", perPage: 12 })
    const [loading, setLoading] = useState<boolean>(false);

    const LoadPost = ({ page, perPage, author, category, search }: { page?: number, perPage?: number, author?: string, category?: string, search?: string }) => {
        setLoading(true)
        const params = {
            select: "title description image link",
            author: author || "",
            category: category || "",
            perPage: `${perPage || 12}`,
            page: `${page || 1}`,
            search: `${search || ""}`,
            requestAs: "admin"
        };
        Api.get(`/api/post/list`, { params, withCredentials: true }
        ).then(response => {
            setPosts(response.data?.result);
            setLoading(false);
            setFilters({ ...filters, ...response.data })
        }).catch(() => setLoading(false))
    }

    useEffect(() => {
        LoadPost({})
    }, [])


    return (
        <>
            <LayoutAdmin head={<title>Posts</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-12">
                        <div className="col-span-12">
                            <a href="/admin/post/create">
                                <button className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                    Nova postagem
                                </button>
                            </a>
                            <button onClick={() => LoadPost({})} className="mr-5 my-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg">
                                Recarregar
                            </button>
                            <hr />
                        </div>
                        <div className="col-span-12">
                            <SearchBar datas={{
                                categories: categories?.map(category => { return { name: category.name, link: category.name } }),
                                authors: authors?.map(author => { return { name: author.username, link: author.username } }),
                                perPage: filters.perPage,
                                search: filters.search
                            }} info={info} onSubmit={(e, datas) => { e.preventDefault(); LoadPost({ perPage: datas.perPage, search: datas.search, author: datas.selectedAuthor, category: datas.selectedCategory }); }} />
                            <Navigation callBack={page => LoadPost({ ...filters, page })} info={info} page={filters.page} pages={filters.pages} />
                            <hr />
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-12 sm:col-span-10 mx-auto">

                            {!loading ? posts?.map((post, i) => {
                                return <PostCardAdmin info={info} post={post} editLink={'/admin/post/edit/' + encodeURI(post.link)} reload={() => LoadPost({})} key={i} />
                            }) :
                                <div className="flex justify-center items-center h-64">
                                    <img src="/img/load.gif" alt="loading" className="w-12" />
                                </div>
                            }
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-12">
                            <hr />
                            <Navigation callBack={page => LoadPost({ ...filters, page })} info={info} page={filters.page} pages={filters.pages} />
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        </>
    )

}

export default Index