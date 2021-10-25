import React, { Component } from 'react';
import Identicon from 'identicon.js';
// import photo from '../../meteor-solid.svg'
import './Navbar.css'

class Navbar extends Component {

	render() {
		return (
			<nav className="navbar navbar-dark">
				<div className="logo-container">
					<a  href="/" rel="noopener noreferrer">
						<svg className="nav-logo svg-inline--fa fa-meteor fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="meteor" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M511.328,20.8027c-11.60759,38.70264-34.30724,111.70173-61.30311,187.70077,6.99893,2.09372,13.4042,4,18.60653,5.59368a16.06158,16.06158,0,0,1,9.49854,22.906c-22.106,42.29635-82.69047,152.795-142.47819,214.40356-.99984,1.09373-1.99969,2.5-2.99954,3.49995A194.83046,194.83046,0,1,1,57.085,179.41009c.99985-1,2.40588-2,3.49947-3,61.59994-59.90549,171.97367-120.40473,214.37343-142.4982a16.058,16.058,0,0,1,22.90274,9.49988c1.59351,5.09368,3.49947,11.5936,5.5929,18.59351C379.34818,35.00565,452.43074,12.30281,491.12794.70921A16.18325,16.18325,0,0,1,511.328,20.8027ZM319.951,320.00207A127.98041,127.98041,0,1,0,191.97061,448.00046,127.97573,127.97573,0,0,0,319.951,320.00207Zm-127.98041-31.9996a31.9951,31.9951,0,1,1-31.9951-31.9996A31.959,31.959,0,0,1,191.97061,288.00247Zm31.9951,79.999a15.99755,15.99755,0,1,1-15.99755-15.9998A16.04975,16.04975,0,0,1,223.96571,368.00147Z"></path></svg>
						<div className="logo-text">
							Dapp
							<span className="bold">Overflow</span>
						</div>
					</a>
				</div>
				<ul className="navbar-nav px-3">
					<li className="nav-item">
						<span className="account">{this.props.account}</span>
					</li>
				</ul>
				{this.props.account
					? <img
						className='account-icon ml-2'
						width='30'
						height='30'
						src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
						alt="Logo"
					/>
					: <span></span>
				}
			</nav>
		);
	}
}

export default Navbar;