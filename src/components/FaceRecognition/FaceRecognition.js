import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({imageSource, box}) => {
	
	if (imageSource) {
		const boxes = []
		let indexSpecial123 = 0;	
		for (const square of box) {
			indexSpecial123 = indexSpecial123 + 1;
			boxes.push(<div key={indexSpecial123} className='boundingBox' style={{top:square.y1, right:square.x2, bottom:square.y2, left:square.x1 }}> </div>)
		}
		return(
			<div className='center ma'>
				<div className='absolute mt2'>
	 				<img id='inputImage' width='500px' heigh='auto' alt="Faces" src={imageSource}/>
					{boxes}
	 			</div>
	 		</div>
			);
	}
	else
		return(
			<div></div>
			);
}

export default FaceRecognition;

// <img src={"https://assets.stickpng.com/images/5856a83e4f6ae202fedf276d.png"}/> - Pokud chci dát místo ohraničení klec
//https://png.pngtree.com/element_our/sm/20180529/sm_5b0db2cba8509.jpg - love