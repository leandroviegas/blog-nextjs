import React from 'react'
import Link from 'next/link'
import { FaHome, FaSearch } from 'react-icons/fa'
import Router from 'next/router'

interface MyProps {
    info: any,
    categories: {
        name: string,
        color: string
    }[]
}

interface MyState {
    info: any,
    categories: {
        name: string,
        color: string
    }[],
    menuClass: string
}

class Login extends React.Component<MyProps, MyState> {
    search: React.RefObject<HTMLInputElement>;

    constructor(props: any) {
        super(props);
        this.state = { ...props, menuClass: "hidden", categories: [{ name: "", color: "" }] }
        this.search = React.createRef<HTMLInputElement>();
    }

    componentDidUpdate() {
        if (this.state.info !== this.props.info)
            this.setState({ ...this.props, menuClass: this.state.menuClass })
        this.search.current.value = String(Router.query.q || "")
    }

    render() {

        return (
            <nav
                className={`flex items-center justify-between flex-wrap bg-${this.state?.info?.colors?.background?.color} py-2 lg:px-12 shadow-lg border-solid border-t-2 border-${this.state?.info?.colors?.background?.shadow}`}>
                <div className={`flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-b-2 border-${this.state?.info?.colors?.text?.color} pb-5 lg:pb-0`}>
                    <div className={`flex items-center flex-shrink-0 text-${this.state?.info?.colors?.text?.color} mr-6`}>
                        <Link href="/">
                            <a>
                                <div className="text-2xl tracking-tight flex items-center">
                                    {this.state?.info?.icon ?
                                        (<img className="h-24 sm:h-14 mr-2" src={this.state?.info?.icon} />) :
                                        (<FaHome />)}
                                    <i className={`ml-2 not-italic pb-1 hidden md:block text-${this.state?.info?.colors?.text?.color} hover:text-${this.state?.info?.colors?.text?.shadow}`}>{this.state?.info?.websiteName || "Home"}</i></div>
                            </a>
                        </Link>
                    </div>
                    <div className="flex items-center lg:hidden">
                        <button onClick={() => this.setState({ ...this.state, menuClass: this.state.menuClass === "" ? "hidden" : "" })}
                            id="nav"
                            className={`flex items-center px-3 mr-4 py-2 border-2 rounded text-${this.state?.info?.colors?.text?.color} hover:text-${this.state?.info?.colors?.text?.color} border-${this.state?.info?.colors?.text?.color || "gray-white"} hover:text-${this.state?.info?.colors?.text?.shadow || "gray-100"} hover:text-${this.state?.info?.colors?.text?.shadow || "gray-100"} hover:border-${this.state?.info?.colors?.text?.shadow || "gray-100"}`}>
                            <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
                                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={`${this.state.menuClass} menu w-full flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8`}>
                    <div className="text-lg lg:flex-grow">
                        {
                            this.props?.categories?.map(category => {
                                return (
                                    <Link key={category.name} href={'/category/' + encodeURI(category.name)}>
                                        <a className={`text-${this.state?.info?.colors?.text?.color} hover:text-${this.state?.info?.colors?.text?.shadow} block mt-4 lg:inline-block lg:mt-0 px-4 py-2 rounded mr-2`}>
                                            {category.name}
                                        </a>
                                    </Link>
                                )
                            })
                        }
                        <Link href="/sobre">
                            <a className={`text-${this.state?.info?.colors?.text?.color} hover:text-${this.state?.info?.colors?.text?.shadow} block mt-4 lg:inline-block lg:mt-0 px-4 py-2 rounded mr-2`}>
                                Sobre
                            </a>
                        </Link>
                        <Link href="/contato">
                            <a className={`text-${this.state?.info?.colors?.text?.color} hover:text-${this.state?.info?.colors?.text?.shadow} block mt-4 lg:inline-block lg:mt-0 px-4 py-2 rounded mr-2`}>
                                Contato
                            </a>
                        </Link>
                    </div>
                    <form onSubmit={e => {
                        e.preventDefault(); Router.push({
                            pathname: '/search',
                            search: this.search.current?.value ? `?q=${this.search.current?.value}` : ""
                        })
                    }} className={`relative mx-auto text-${this.state?.info?.colors?.text?.color} lg:block hidden`}>
                        <label aria-label="search">
                            <input ref={this.search} className={`text-${this.state?.info?.colors?.text?.color} placeholder-${this.state?.info?.colors?.text?.shadow} border-2 border-${this.state?.info?.colors?.text?.color} bg-${this.state?.info?.colors?.background?.color} h-10 pl-2 pr-8 rounded-lg text-sm focus:outline-none`}
                                type="text" name="search" id="search" placeholder="Procurar" />
                        </label>
                        <button type="submit" aria-label="submit" className={`text-${this.state?.info?.colors?.text?.color} absolute right-0 top-0 mt-3 mr-2`}>
                            <FaSearch />
                        </button>
                    </form>
                    <div className="flex">
                        {/* <a href="#"
                            className="block text-md px-4 py-2 rounded text-gray-100 hover:text-gray-300 ml-2 font-bold mt-4 lg:mt-0">Sign
                        in</a>

                        <a href="#"
                            className="block text-md px-4 ml-2 py-2 rounded text-gray-100 hover:text-gray-300 font-bold mt-4 lg:mt-0">login</a> */}
                    </div>
                </div>

            </nav >
        )
    }
}

export default Login