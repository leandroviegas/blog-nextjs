import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import Head from 'next/head'
import Cookies from 'cookies'
import Api from '../../services/api'
import Navbar from '../../components/navbar_admin_area'
import '../../components/LoadClasses'
import uploadImages from '../../services/uploadImage'
import bcrypt from 'bcryptjs'
import { GetServerSideProps } from 'next'
import DbConnect, { Config } from '../../database/connection'

interface info {
    websiteName: string,
    description: string,
    keywords: string,
    icon: string,
    colors: {
        background: {
            shadow: string,
            color: string
        },
        text: {
            shadow: string,
            color: string
        }
    }
}

interface homePageInfo {
    title: string,
    description: string,
    banner: string,
    head: string
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()

    const cookies = new Cookies(req, res)
    let Info = null
    try {
        Info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        Info = Info._doc.content
    } catch (e) { }

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, cookies.get('AdminAreaAuth'))) {
        return {
            props: {
                Info,
                user: { username: process.env.ADMINUSERNAME }
            }
        }
    } else {
        return {
            redirect: {
                destination: '/AdminArea',
                permanent: false,
            }
        }
    }
}

const Index = ({ Info, user }) => {
    const [info, setInfo] = useState<info>(Info)
    const [infoInputs, setInfoInputs] = useState<info>(Info)

    const [homePageInfo, setHomePageInfo] = useState<homePageInfo>()
    const [homePageInfoInputs, setHomePageInfoInputs] = useState<homePageInfo>({ title: "", description: "", banner: "", head: "" })

    const [bannerFile, setBannerFile] = useState<{ preview: any; file: File }>({
        preview: homePageInfoInputs?.banner || undefined,
        file: undefined
    })
    const [iconFile, setIconFile] = useState<{ preview: any; file: File }>({
        preview: info?.icon || undefined,
        file: undefined
    })

    const [textColorPopup, setTextColorPopup] = useState<boolean>(false)
    const [textShadowPopup, setTextShadowPopup] = useState<boolean>(false)
    const [backgroundColorPopup, setBackgroundColorPopup] = useState<boolean>(false)
    const [backgroundShadowPopup, setBackgroundShadowPopup] = useState<boolean>(false)

    const HandleInformationsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const save = (icon: string) => {
            Api.post('/api/config?name=info', { content: { ...infoInputs, icon } }, { withCredentials: true }).then(response => {
                loadInfo1()
            })
        }

        if (iconFile.file) {
            save((await uploadImages(iconFile.file)).secure_url)
        } else {
            save(info?.icon)
        }
    }

    const HandleHomePageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const save = (banner: string) => {
            Api.post('/api/config?name=homePageInfo', { content: { ...homePageInfoInputs, banner } }, { withCredentials: true }).then(response => {
                loadHomePageInfo()
            })
        }

        if (bannerFile.file) {
            save((await uploadImages(bannerFile.file)).secure_url)
        } else {
            save(homePageInfo?.banner)
        }
    }



    const loadInfo1 = () => Api.get('/api/config?name=info').then(response => {
        setInfo(response.data?.result?.content)
        setInfoInputs(response.data?.result?.content)
    })

    const loadHomePageInfo = () => Api.get('/api/config?name=homePageInfo').then(response => {
        setHomePageInfo(response.data?.result?.content)
        setHomePageInfoInputs(response.data?.result?.content)
    })

    useEffect(() => {
        loadInfo1()
        loadHomePageInfo()
    }, [Info])

    let colors = ["green", "blue", , "indigo", "purple", "pink", "red", "yellow", "gray"]
    let intonations = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]

    return (
        <>
            {backgroundColorPopup ?
                <div className="h-full w-full top-0 left-0 fixed">
                    <div onClick={() => { $("body").css({ "overflow-y": "auto" }); setBackgroundColorPopup(false); }} className="bg-black opacity-50 h-full w-full z-10 absolute">
                    </div>
                    <div className="h-full w-full flex justify-center items-center z-20">
                        <div className="bg-white rounded px-12 py-4 z-20">
                            <div className="py-1">
                                <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Box Color: </label><br />
                                {
                                    colors.map(color => {
                                        return (
                                            <div className="py-1" key={`${color}-BoxColor`}>
                                                {
                                                    intonations.map(intonation => {
                                                        return (
                                                            <div key={`${color}-${intonation}-BoxColor`} className="inline-flex">
                                                                <input type="radio" id={`${color}-${intonation}-BoxColor`} name="boxColor" className={`background-radio bg-${color}-${intonation}`} />
                                                                <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, background: { ...infoInputs?.colors?.background, color: `${color}-${intonation}` } } })} className={`bg-${color}-${intonation}`} htmlFor={`${color}-${intonation}-BoxColor`}></label>
                                                            </div>
                                                        )
                                                    })}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div> :
                ""}

            {backgroundShadowPopup ?
                <div className="h-full w-full top-0 left-0 fixed">
                    <div onClick={() => { $("body").css({ "overflow-y": "auto" }); setBackgroundShadowPopup(false); }} className="bg-black opacity-50 h-full w-full z-10 absolute">
                    </div>
                    <div className="h-full w-full flex justify-center items-center z-20">
                        <div className="bg-white rounded px-12 py-4 z-20">
                            <div className="py-1">
                                <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Shadow box Color: </label><br />
                                {
                                    colors.map(color => {

                                        return (
                                            <div className="py-1" key={`${color}-ShadowBoxColor`}>
                                                {
                                                    intonations.map(intonation => {
                                                        return (
                                                            <div key={`${color}-${intonation}-ShadowBoxColor`} className="inline-flex">
                                                                <input type="radio" id={`${color}-${intonation}-ShadowBoxColor`} name="ShadowBoxColor" className={`background-radio bg-${color}-${intonation}`} />
                                                                <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, background: { ...infoInputs?.colors?.background, shadow: `${color}-${intonation}` } } })} className={`bg-${color}-${intonation}`} htmlFor={`${color}-${intonation}-ShadowBoxColor`}></label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div> :
                ""}

            {textColorPopup ?
                <div className="h-full w-full top-0 left-0 fixed">
                    <div onClick={() => { $("body").css({ "overflow-y": "auto" }); setTextColorPopup(false); }} className="bg-black opacity-50 h-full w-full z-10 absolute">
                    </div>
                    <div className="h-full w-full flex justify-center items-center z-20">
                        <div className="bg-white rounded px-12 py-4 z-20">
                            <div className="py-1">
                                <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Text Color: </label><br />
                                {
                                    colors.map(color => {

                                        return (
                                            <div className="py-1" key={`${color}-textColor`}>
                                                {
                                                    intonations.map(intonation => {
                                                        return (
                                                            <div key={`${color}-${intonation}-textColor`} className="inline-flex">
                                                                <input type="radio" id={`${color}-${intonation}-textColor`} name="textColor" className={`text-radio text-${color}-${intonation}`} />
                                                                <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, text: { ...infoInputs?.colors?.text, color: `${color}-${intonation}` } } })} className={`text-${color}-${intonation}`} htmlFor={`${color}-${intonation}-textColor`}>Aa</label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div> :
                ""}

            {textShadowPopup ?
                <div className="h-full w-full top-0 left-0 fixed">
                    <div onClick={() => { $("body").css({ "overflow-y": "auto" }); setTextShadowPopup(false); }} className="bg-black opacity-50 h-full w-full z-10 absolute">
                    </div>
                    <div className="h-full w-full flex justify-center items-center z-20">
                        <div className="bg-white rounded px-12 py-4 z-20">
                            <div className="py-1">
                                <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Text shadow Color: </label><br />
                                {
                                    colors.map(color => {

                                        return (
                                            <div className="py-1" key={`${color}-ShadowTextColor`}>
                                                {
                                                    intonations.map(intonation => {
                                                        return (
                                                            <div key={`${color}-${intonation}-ShadowTextColor`} className="inline-flex">
                                                                <input type="radio" id={`${color}-${intonation}-ShadowTextColor`} name="ShadowTextColor" className={`text-radio text-${color}-${intonation}`} />
                                                                <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, text: { ...infoInputs?.colors?.text, shadow: `${color}-${intonation}` } } })} className={`text-${color}-${intonation}`} htmlFor={`${color}-${intonation}-ShadowTextColor`}>Aa</label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div> :
                ""}

            <Head>
                <title>Configurations</title>
                <link rel="stylesheet" href="/css/admin/config.css" />
            </Head>
            <Navbar info={infoInputs} user={user} />
            <div className="container py-4 mx-auto">
                <form onSubmit={HandleInformationsSubmit}>
                    <div className="grid grid-cols-3 border shadow-lg text-center md:text-left">
                        <div className={"col-span-3 bg-" + (infoInputs?.colors?.background?.shadow || "gray-500")}>
                            <h2 className={`font-semibold text-2xl my-2 mx-4 text-${infoInputs?.colors?.text?.color || "white"}`}>Informations</h2>
                        </div>
                        <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                            <div className="py-1">
                                <label htmlFor="websiteName" className="font-semibold text-gray-700">Website name: </label><br />
                                <input value={infoInputs?.websiteName} onChange={e => setInfoInputs({ ...infoInputs, websiteName: e.target.value })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-700" type="text" name="websiteName" />
                            </div>
                            <div className="py-1 pt-5 md:pt-0">
                                <label htmlFor="description" className="font-semibold text-gray-700">Description: </label><br />
                                <textarea value={infoInputs?.description} onChange={e => setInfoInputs({ ...infoInputs, description: e.target.value })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-700" name="description"></textarea>
                            </div>
                            <div className="py-1 pt-5 md:pt-0">
                                <label htmlFor="description" className="font-semibold text-gray-700">Keywords: </label><br />
                                <textarea value={infoInputs?.keywords} onChange={e => setInfoInputs({ ...infoInputs, keywords: e.target.value })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-700" name="description"></textarea>
                            </div>
                        </div>
                        <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                            <span className="font-semibold text-gray-700 py-1">Icon: </span>
                            <div className="py-3">
                                <label aria-label="icon">
                                    <input className="hidden" onChange={e => { setIconFile({ file: e.target.files[0], preview: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : undefined }); setInfoInputs({ ...infoInputs, icon: "" }) }} type="file" id="file" name="icon" accept="image/x-png,image/jpeg" />
                                    <div className="pb-4">
                                        <span className={`bg-${infoInputs?.colors?.background?.color} mt-4 hover:bg-${infoInputs?.colors?.background?.shadow} rounded px-4 py-2 text-${infoInputs?.colors?.text?.shadow} hover:text-${infoInputs?.colors?.text?.color} font-semibold`}>Choose Icon</span>
                                    </div>

                                    <div style={{ maxWidth: "17em" }} className={`w-full mx-auto md:ml-0 h-36 p-4 bg-${infoInputs?.colors?.background?.color} shadow-lg border border-${infoInputs?.colors?.background?.shadow}`}>
                                        {iconFile.preview ?
                                            <img id="icon-img" alt="icon" src={iconFile?.preview} className={`mx-auto shadow-lg h-full`} />
                                            :
                                            <div>

                                            </div>
                                        }
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                            <div className="py-1">
                                <label htmlFor="websiteName" className="font-semibold text-gray-700">Box color: </label><br />
                                <div className="flex items-center justify-center md:justify-start">
                                    <button type="button" className={`px-4 py-2 bg-${infoInputs?.colors?.background?.color || "gray-500"} hover:bg-${infoInputs?.colors?.background?.shadow || "gray-700"} inline-flex text-${infoInputs?.colors?.text?.color || "white"} hover:text-${infoInputs?.colors?.text?.shadow || "gray-100"} my-2 font-semibold`} onClick={() => setBackgroundColorPopup(true)}>Select Color</button><div className={"w-8 h-8 m-2 bg-" + (infoInputs?.colors?.background?.color || "gray-500")}></div>
                                </div>
                            </div>
                            <div className="py-1 pt-5 md:pt-0">
                                <label htmlFor="websiteName" className="font-semibold text-gray-700">Shadow box color: </label><br />
                                <div className="flex items-center justify-center md:justify-start">
                                    <button type="button" className={`px-4 py-2 bg-${infoInputs?.colors?.background?.color || "gray-500"} hover:bg-${infoInputs?.colors?.background?.shadow || "gray-700"} inline-flex text-${infoInputs?.colors?.text?.color || "white"} hover:text-${infoInputs?.colors?.text?.shadow || "gray-100"} my-2 font-semibold`} onClick={() => setBackgroundShadowPopup(true)}>Select Color</button><div className={"w-8 h-8 m-2 bg-" + (infoInputs?.colors?.background?.shadow || "gray-700")}></div>
                                </div>
                            </div>
                            <div className="py-1 pt-5 md:pt-0">
                                <label htmlFor="websiteName" className="font-semibold text-gray-700">Text color: </label><br />
                                <div className="flex items-center justify-center md:justify-start">
                                    <button type="button" className={`px-4 py-2 bg-${infoInputs?.colors?.background?.color || "gray-500"} hover:bg-${infoInputs?.colors?.background?.shadow || "gray-700"} inline-flex text-${infoInputs?.colors?.text?.color || "white"} hover:text-${infoInputs?.colors?.text?.shadow || "gray-100"} my-2 font-semibold`} onClick={() => setTextColorPopup(true)}>Select Color</button><div className={"text-2xl m-2 text-" + (infoInputs?.colors?.text?.color || "gray-500")}>Aa</div>
                                </div>
                            </div>
                            <div className="py-1 pt-5 md:pt-0">
                                <label htmlFor="websiteName" className="font-semibold text-gray-700">Shadow text color: </label><br />
                                <div className="flex items-center justify-center md:justify-start">
                                    <button type="button" className={`px-4 py-2 bg-${infoInputs?.colors?.background?.color || "gray-500"} hover:bg-${infoInputs?.colors?.background?.shadow || "gray-700"} inline-flex text-${infoInputs?.colors?.text?.color || "white"} hover:text-${infoInputs?.colors?.text?.shadow || "gray-100"} my-2 font-semibold`} onClick={() => setTextShadowPopup(true)}>Select Color</button><div className={"text-2xl m-2 text-" + (infoInputs?.colors?.text?.shadow || "gray-700")}>Aa</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 mb-4 mt-2 text-center">
                            <hr className="mx-4" />
                            {
                                info === infoInputs ?
                                    <button className="bg-gray-100 mt-4 hover:bg-gray-200 rounded px-4 py-2 text-gray-900 font-semibold" type="button">Save</button>
                                    :
                                    <button className={`bg-${infoInputs?.colors?.background?.color} mt-4 hover:bg-${infoInputs?.colors?.background?.shadow} rounded px-4 py-2 text-${infoInputs?.colors?.text?.shadow} hover:text-${infoInputs?.colors?.text?.color} font-semibold`} type="submit">Save</button>
                            }
                        </div>
                    </div>
                </form>

                <form onSubmit={HandleHomePageSubmit}>
                    <div className="grid grid-cols-3 my-6 border shadow-lg text-center md:text-left">
                        <div className={"col-span-3 bg-" + (infoInputs?.colors?.background?.shadow || "gray-500")}>
                            <h2 className={`font-semibold text-2xl my-2 mx-4 text-${infoInputs?.colors?.text?.color || "white"}`}>Home page</h2>
                        </div>
                        <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                            <div className="py-1">
                                <label htmlFor="websiteName" className="font-semibold text-gray-700">Title: </label><br />
                                <input value={homePageInfoInputs?.title} onChange={e => setHomePageInfoInputs({ ...homePageInfoInputs, title: e.target.value })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-700" type="text" name="websiteName" />
                            </div>
                            <div className="py-1">
                                <label htmlFor="description" className="font-semibold text-gray-700">Description: </label><br />
                                <textarea value={homePageInfoInputs?.description} onChange={e => setHomePageInfoInputs({ ...homePageInfoInputs, description: e.target.value })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-700" name="description"></textarea>
                            </div>
                            <div className="py-1">
                                <label htmlFor="description" className="font-semibold text-gray-700">Html Head: </label><br />
                                <textarea value={homePageInfoInputs?.head} onChange={e => setHomePageInfoInputs({ ...homePageInfoInputs, head: e.target.value })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-700" name="description"></textarea>
                            </div>
                        </div>
                        <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                            <span className="font-semibold text-gray-700 py-1">Banner: </span>
                            <div className="py-3">
                                <label aria-label="Banner">
                                    <input className="hidden" onChange={e => { setBannerFile({ file: e.target.files[0], preview: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : undefined }); setHomePageInfoInputs({ ...homePageInfoInputs, banner: "" }) }} type="file" id="file" name="icon" accept="image/x-png,image/jpeg" />
                                    <div className="pb-4">
                                        <span className={`bg-${infoInputs?.colors?.background?.color} mt-4 hover:bg-${infoInputs?.colors?.background?.shadow} rounded px-4 py-2 text-${infoInputs?.colors?.text?.shadow} hover:text-${infoInputs?.colors?.text?.color} font-semibold`}>Choose Banner</span>
                                    </div>

                                    <div style={{ maxWidth: "25em" }} className={`w-full h-44 p-4 bg-${infoInputs?.colors?.background?.color} shadow-lg border border-${infoInputs?.colors?.background?.shadow}`}>
                                        {bannerFile.preview ?
                                            <img id="icon-img" alt="icon" src={bannerFile?.preview} className={`mx-auto shadow-lg h-full`} />
                                            :
                                            <div>

                                            </div>
                                        }
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="col-span-3 mb-4 mt-2 text-center">
                            <hr className="mx-4" />
                            {
                                homePageInfo === homePageInfoInputs ?
                                    <button className="bg-gray-100 mt-4 hover:bg-gray-200 rounded px-4 py-2 text-gray-900 font-semibold" type="button">Save</button>
                                    :
                                    <button className={`bg-${infoInputs?.colors?.background?.color} mt-4 hover:bg-${infoInputs?.colors?.background?.shadow} rounded px-4 py-2 text-${infoInputs?.colors?.text?.shadow} hover:text-${infoInputs?.colors?.text?.color} font-semibold`} type="submit">Save</button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </>
    )

}

export default Index