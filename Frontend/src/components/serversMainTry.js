import React, { Component } from 'react';
import './App.css';
import {
    getAllNames,
    addNewName,
    getAllServers,
    getAllUsedServers,
    getAllComments,
    addServer,
    removeServer,
    addComment,
    removeComment
} from '../constants/url';
import { header } from '../constants/headers';
import { postMethod, getMethod } from '../constants/methods';
import { nameAlert, commentAlert, serverSelectAlert } from '../constants/alerts';
import CreatableSelect from 'react-select/creatable';

const Packages = 'packages';
const Services = 'services';

class ServersMain extends Component {
    
    constructor() {
        super();
        this.state = { loading: false, servers: [], tomcatServers: [], dockerServers: [], comments: [], names: [], ipPack: '', ipServ: '', usedServ: [], usedPack: [], containerName: "", dkrSer: '', dkrContNo: null, enabled: null, enable: true }
        this.selectedName = '';
        this.handleCreate = this.handleCreate.bind(this)
    }
    
    componentDidMount() {
        this.getNames();
        this.getServers();
    }

    handleChange = (selectedOption) => {
        if(selectedOption !== null) {
            this.setState({selectedName: selectedOption.value})
            // console.log("selected", this.state.selectedName);
        }
        else if (selectedOption === null) {
            this.setState({selectedName: ''})
        }
    }

    async handleCreate(newName) {
        this.setState({loading: true})
        await fetch(addNewName, {
            method: postMethod,
            headers: header,
            body: JSON.stringify({
                name: newName
            })
        })
        .then(res => res.json())
        setTimeout(() => {
            this.getNames()
            this.setState({loading: false})
        }, 500)
    }

    async getNames() {
        let promise = await fetch(getAllNames, {
            method: getMethod,
            headers: header
        })
        const data = await promise.json();
        const final = data.sort((a,b) => (a.label.toUpperCase() > b.label.toUpperCase()) ? 1 : -1 );
        this.setState({names: final})
        // console.log('NAMES', final)
    }

    async getServers() {
        let promise = await fetch(getAllServers, {
            method: getMethod,
            headers: header,
        })
        const data = await promise.json();
        const pack = data.filter((d) => d.freePkg === false)
        const ser = data.filter((d) => d.freeSer === false)
        const tomSer = data.filter((d) => d.isDocker === false)
        const dkrSer = data.filter((d) => d.isDocker === true)
        this.setState({usedPack: pack})
        this.setState({usedServ: ser})
        this.setState({servers: data})
        this.setState({tomcatServers: tomSer})
        this.setState({dockerServers: dkrSer})
        // console.log(da);
    }

    async addUseServer(ip, name, comp, comments) {
        // console.log('In func', ip, name, comp, comments);
        await fetch(addServer, {
            method: postMethod,
            headers: header,
            body: JSON.stringify({
                ip: ip,
                name: name,
                comp: comp,
                comment: comments
            })
        })
        .then(res => res.json())
        .then(res => res === 'duplicate' ? alert('Names of 2 container\'s cannot be same on a single server!') : null);
        setTimeout(() => this.getServers() , 250);
        // this.getServers();
    }

    async removeUseServer(ip, comp) {
        await fetch(removeServer, {
            method: postMethod,
            headers: header,
            body: JSON.stringify({
                ip: ip,
                comp: comp
            })
        })
        .then(res => res.json())
        // .then(res => console.log(res));
        setTimeout(() => this.getServers() , 250);
    }

    async removeUseDkrCont(ip, cont) {
        console.log(ip, cont)
        await fetch(removeServer, {
            method: postMethod,
            headers: header,
            body: JSON.stringify({
                ip: ip,
                cont: cont,
            })
        })
        .then(res => res.json())
        .then(res => console.log(res));
        setTimeout(() => this.getServers() , 250);
        // this.getServers();
    }

    handleSubmit(comments) {
        // console.log('CPONTAINET', this.state.containerName, this.state.dkrSer, this.state.selectedName, this.state.dkrContNo )
        if(this.state.selectedName) {
            if(this.state.ipPack || this.state.ipServ) {
                // console.log('Pack',this.state.ipPack,'Serv', this.state.ipServ)
                if(!comments) {
                    if(this.state.ipPack) {
                        this.addUseServer(this.state.ipPack, this.state.selectedName, Packages);
                    }
                    if(this.state.ipServ) {
                        this.addUseServer(this.state.ipServ, this.state.selectedName, Services);
                    }
                    this.setState({ipPack : '', ipServ: ''})
                }
                else {
                    if(this.state.ipPack === this.state.ipServ) {
                        this.addUseServer(this.state.ipPack, this.state.selectedName, Packages, comments);
                        this.addUseServer(this.state.ipServ, this.state.selectedName, Services, comments);
                        this.setState({ipPack : '', ipServ: ''})
                        document.getElementById('commentArea').value = '';
                    }
                    else {
                        if(!this.state.ipPack) {
                            this.addUseServer(this.state.ipServ, this.state.selectedName, Services, comments);
                            this.setState({ipPack : '', ipServ: ''})
                            document.getElementById('commentArea').value = '';
                        }
                        else if(!this.state.ipServ) {
                            this.addUseServer(this.state.ipPack, this.state.selectedName, Packages, comments);
                            this.setState({ipPack : '', ipServ: ''})
                            document.getElementById('commentArea').value = '';
                        }
                        else {
                            if(window.confirm(`This will add the comment for both the servers selected!
Do you wanna proceed?`)) {
                                this.addUseServer(this.state.ipPack, this.state.selectedName, Packages, comments);
                                this.addUseServer(this.state.ipServ, this.state.selectedName, Services, comments);
                                this.setState({ipPack : '', ipServ: ''})
                                document.getElementById('commentArea').value = '';
                            }
                        }
                    }
                }
            }
            if(this.state.dkrSer) {
                if(!this.state.containerName) {
                    alert('Please enter container name!')
                }
                else {
                    if(!comments) {
                        this.addUseServer(this.state.dkrSer, this.state.selectedName, this.state.containerName)
                    }
                    else {
                        this.addUseServer(this.state.dkrSer, this.state.selectedName, this.state.containerName, comments)
                    }
                    Array.from(document.querySelectorAll("input")).forEach(
                        input => (input.value = "")
                    );
                    Array.from(document.querySelectorAll("input")).forEach(
                        input => (input.checked = false)
                    );
                    document.getElementById('commentArea').value = '';
                    this.setState({enabled: [], dkrSer: "", containerName: ""})
                }
            }
            else if(!this.state.ipPack && !this.state.ipServ && !this.state.dkrSer){
                alert(serverSelectAlert)
            }
        }
        else {
            alert(nameAlert)
        }
    }

    handleClickPackages(e) {
        if(e.target.checked) {
            this.setState({ipPack: e.target.value})
        }
    }
    
    handleClickServices(e) {
        if(e.target.checked) {
            this.setState({ipServ: e.target.value})
        }
    }
    
    handleClickDocker(index, ip) {
        this.setState({enabled: index, enable: true, dkrSer: ip})
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
    }

    render() {
        return (
            <div id="accordion" className="panel-group">

                { /* START OF FREE SERVERS SECTION */ }

                <div className="container panel containerfree">
                    <div className="row row1">
                        <center>
                        <button className="col-md-5 btn btn-danger row1butt">FREE SERVERS</button>
                        </center>
                    </div>
                    <div className = 'row row2'>
                        <div className="row">
                            <h3 className="col-md-3"></h3>
                            <h3 className="col-md-2"><u>Server IP</u></h3>
                            <h3 className="col-md-2 packHead" ><u>Packages</u></h3>
                            <h3 className="col-md-2 servHead"><u>Services</u></h3>
                        </div>
                        <div className="row">
                            <div className='form-group col-md-3 marginTop125 marginRight100'>
                                <h4 className="col-md-12 nameHead">Please Select Your Name</h4>
                                <CreatableSelect
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="Select Your Name" 
                                    isClearable="true" 
                                    isSearchable="true"
                                    onChange={this.handleChange}
                                    onCreateOption={this.handleCreate}
                                    options={this.state.names}
                                    isDisabled={this.state.loading}
                                    isLoading={this.state.loading}
                                />
                            </div>
                            <div className="col-md-5">
                            <div>
                                    <h5 className="serverInfo">Tomcat Servers</h5>
                            </div>
                            {
                                this.state.tomcatServers.map(char => {
                                    return (
                                        <div className="row listRow">
                                            <li className="col-md-6"><b>{char.ip}</b>
                                                {
                                                    char.ip === '10.66.39.48' ?  ` (Dev Server)` : ''
                                                }
                                            </li>
                                            <div className="col-md-3">
                                                {
                                                    // char.freePkg === true ? <button className="btn btn-primary" onClick={() => this.checkPackages(char.ip)}>+</button> : <div style={{marginBottom: '35px'}}></div>
                                                    char.freePkg === true ? 
                                                    <label className="checkbox-container marginBottom">
                                                        <input type="radio" name="radioOne" value={char.ip} onClick={this.handleClickPackages.bind(this)}/>
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    : 
                                                    <div className="marginBottom">
                                                        <label className="checkbox-container marginBottom disabledcheck" >
                                                            <input type="radio" name="radio" checked="checked" disabled="disabled" />
                                                            <span className="checkmark" style={{backgroundColor:'#999'}}></span>
                                                        </label>
                                                    </div>
                                                }
                                            </div>
                                            <div  className="col-md-3">
                                                {
                                                    // char.freeSer === true ? <button className="btn btn-primary" onClick={() => this.checkServices(char.ip)}>+</button> : <div  style={{marginBottom: '35px'}}></div>
                                                    char.freeSer === true ? 
                                                    <label className="checkbox-container marginBottom">
                                                        <input type="radio" name="radioTwo" value={char.ip} onClick={this.handleClickServices.bind(this)}/>
                                                        <span className="checkmark"></span>
                                                    </label> 
                                                    : 
                                                    <div className="marginBottom">
                                                        <label className="checkbox-container disabledcheck" >
                                                            <input type="radio" name="radio" checked="checked" disabled="disabled" />
                                                            <span className="checkmark" style={{backgroundColor:'#999'}}></span>
                                                        </label>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div>
                                    <h5 className="serverInfo">Docker Servers</h5>
                            </div>
                            <div>
                                    <p><font color="red">Please enter the same name of the container as on the server.</font></p>
                            </div>
                            {
                                this.state.dockerServers.map((char, index) => {
                                    return (
                                        <div className="row listRow">
                                            <li className="col-md-6"><b>{char.ip}</b>
                                                {
                                                    char.ip === '10.66.39.48' ?  ` (Dev Server)` : ''
                                                }
                                            </li>
                                            {
                                                char.containers.length < 3 ?
                                                <div  className="col-md-3">
                                                    <label className="checkbox-container marginBottom">
                                                        <input id="dockerIp" type="radio" name="radioThree" value={char.ip} onClick={() => this.handleClickDocker(index, char.ip)}/>
                                                        <span className="checkmark"></span>
                                                    </label> 
                                                </div>
                                                :
                                                null
                                            }
                                            <div className="col-md-3 marginLeft100">
                                                {
                                                    char.containers.length < 3 ?
                                                    <input 
                                                        className={(this.state.enable && this.state.enabled !== index) ? 't-pointer-none' : 't-pointer-auto'}
                                                        autoComplete="off" 
                                                        type="text" 
                                                        id="cName" 
                                                        name="containerName" 
                                                        placeholder="Container Name" 
                                                        onChange={(e) => this.setState({containerName: e.target.value, enabled: index, enable: [e.target.value.length > 0 ? false: true]})} 
                                                    />
                                                    :
                                                    <p className="noMemLeft">No Memory Left!</p>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                            <div className="col-md-4 marginTop125">
                                <center>
                                    <h4 className="commentsHead">COMMENTS</h4>
                                    <div className='form-group'>
                                        <textarea className="form-control textareaa" id="commentArea" placeholder="Any Comments? e.g. - Please don't change anything on 10.66.39.46, same has been shared with Product team for UAT."/>
                                        <button className="btn btn-primary textareabutt" onClick={() => this.handleSubmit(document.getElementById('commentArea').value)}>Submit</button>
                                    </div>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>

                { /* END OF FREE SERVERS SECTION */ }

                <hr className="AppHr"/>

                { /* START OF USED SERVERS AND COMMENTS SECTION */ }

                <div className="container panel">
                    <div className="row wor1" style={{marginLeft: '45%'}}>
                        <button className="col-md-5 btn btn-danger row2butt">SERVERS BEING USED AND COMMENTS </button>
                    </div>
                    <div className="row row3">
                            <div className="row">
                                <h2 className="col-md-1"></h2>
                                <h4 className="col-md-2">Server IP</h4>
                                <h4 className="col-md-2">User</h4>
                                <h4 className="col-md-2 marginLeft25">Context/Container</h4>
                                <h4 className="col-md-5">Comments</h4>
                            </div>
                            <div className="row row3">
                                <div className="col-md-12">
                                    {
                                        this.state.tomcatServers.map(hero => {
                                                return (
                                                    <div>
                                                    <div className="row">
                                                        {
                                                            hero.freePkg === false ? 
                                                            <div>
                                                                <button className="col-md-1 btn btn-primary removeButt" onClick={() => this.removeUseServer(hero.ip, 'packages')}>
                                                                    X
                                                                </button>
                                                                <li className="col-md-2"><b>{hero.ip}</b></li>
                                                                <li className="col-md-2"><b>{hero.namePkg}</b></li>
                                                                <li className="col-md-2"><b>Packages</b></li>
                                                                    {
                                                                        hero.pkgComment ? <li className="col-md-5"><b>{hero.pkgComment}</b></li> : <div className="col-md-5"></div>
                                                                    }

                                                            </div> 
                                                            : 
                                                            <div></div>
                                                        }
                                                        </div>
                                                        <div className="row">
                                                        {
                                                            hero.freeSer === false ?
                                                            <div>
                                                                <button className="col-md-1 btn btn-primary removeButt" onClick={() => this.removeUseServer(hero.ip, 'services')}>
                                                                    X
                                                                </button>
                                                                <li className="col-md-2"><b>{hero.ip}</b></li>
                                                                <li className="col-md-2"><b>{hero.nameSer}</b></li>
                                                                <li className="col-md-2"><b>Services</b></li>
                                                                    {
                                                                        hero.serComment ? <li className="col-md-5"><b>{hero.serComment}</b></li> : <div className="col-md-5"></div>
                                                                    }
                                                            </div> 
                                                            :
                                                            <div></div>
                                                        }
                                                    </div>
                                                    </div>
                                                )
                                            
                                        })
                                    }
                                    </div>
                                    <div>
                                    {
                                        this.state.dockerServers.map(char => {
                                            return (
                                                <div className="col-md-12">
                                                    {
                                                        char.containers.length > 0 ?
                                                            char.containers.map((cont) => {
                                                                return(
                                                                    <div className="row">
                                                                        <button className="col-md-1 btn btn-primary removeButt" onClick={() => this.removeUseDkrCont(char.ip, cont.name)}>
                                                                            X
                                                                        </button>
                                                                        <li className="col-md-2"><b>{char.ip}</b></li>
                                                                        <li className="col-md-2"><b>{cont.userName}</b></li>
                                                                        <li className="col-md-2"><b>{cont.name}</b></li>
                                                                        {
                                                                          cont.cmnt ? <li className="col-md-5"><b>{cont.cmnt}</b></li> : <div className="col-md-5"></div>
                                                                        }
                                                                        
                                                                    </div>
                                                                )
                                                            })
                                                        :
                                                        null
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                            </div>
                        </div>
                    </div>
                </div>

                { /* END OF USED SERVERS AND COMMENTS SECTION */ }

            </div>
        )
    }
}

export default ServersMain;