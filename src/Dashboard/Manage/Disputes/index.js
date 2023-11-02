import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

class Disputes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    render() {
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
            <div class="block-body">
                <div className="row">
                    <div className="col-lg-12">
                        <h3 className="font-m">Диспуты</h3>
                        <div className='text-center font-m'>Диспуты отсутствуют</div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Disputes