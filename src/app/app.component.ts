import { Component, OnInit } from '@angular/core';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  output = "";
  outputPicture = "";

  professional = {
    noPeople: false,
    multiplePeople: false,
    logo: false,
    smile: true,
    noise: "low",
    blur: "low",
    anger:0.1,
    contempt:0.1,
    fear:0.1,
    sadness:0.1,
    disgust:0.1,
    surprise:0.1,
    exposure:"goodExposure",
    sunglasses: false,
    glasses: "NoGlasses"
  }
  currentPicture = {
    noPeople: null,
    multiplePeople: null,
    logo: null,
    smile: null,
    noise: null,
    blur:null,
    anger: null,
    contempt: null,
    disgust:null,
    fear: null,
    sadness: null,
    surprise: null,
    exposure: null,
    sunglasses: null,
    glasses: null
  }
  picture = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg'
  constructor(private http:HttpClient) {}
  // Uses http.get() to load data from a single API endpoint
  sendPicture() {

  this.currentPicture = {
    noPeople: null,
    multiplePeople: null,
    logo: null,
    smile: null,
    noise: null,
    blur:null,
    anger: null,
    contempt: null,
    disgust:null,
    fear: null,
    sadness: null,
    surprise: null,
    exposure: null,
    sunglasses: null,
    glasses: null
  }
    var status = "";
    this.output = "";
    this.outputPicture = "./assets/img/checkmark.png"
    var labelDetection = {
      "requests": [
        {
          "features": [
            {
              "type": "LABEL_DETECTION"
            }
          ],
          "image": {
            "source": {
              "imageUri": this.picture
            }
          }
        }
      ]
    }
    var logoDetection = {
      "requests": [
        {
          "features": [
            {
              "type": "LOGO_DETECTION"
            }
          ],
          "image": {
            "source": {
              "imageUri": this.picture
            }
          }
        }
      ]
    }
    this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBna2198cL3Z8t2grEH1czQHo8CGw6c_w0", labelDetection, {
      headers:{'Content-Type': 'application/json'}
    }).subscribe(
        data => {
          console.log('label', (<any>data).responses[0]);

          var array = (<any>data).responses[0].labelAnnotations
          for (var i = 0 ; i < array.length; i++) {
            if (array[i].description === "sunglasses") {
              this.currentPicture.sunglasses = true;
              break;
            }
          }
          this.currentPicture.sunglasses = this.currentPicture.sunglasses === true;
                console.log('current', this.currentPicture);
                this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBna2198cL3Z8t2grEH1czQHo8CGw6c_w0", logoDetection, {
            headers:{'Content-Type': 'application/json'}
          }).subscribe(
              data => {
                console.log('logo', (<any>data).responses[0]);

                this.currentPicture.logo = Object.keys((<any>data).responses[0]).length !== 0 && (<any>data).responses[0].logoAnnotation.length > 0
                console.log('current', this.currentPicture);
                this.http.post('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect','{"url" : ' + '"' + this.picture + '"}' , {
                  headers:{'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': '0f7ed84a8e4e4642b20cf0cbdfdeb443'},
                  params: {"returnFaceId": "true", "returnFaceLandmarks": "false",
                  "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"}
                }).subscribe(
                  data => {
                    this.currentPicture.noPeople = (<any>data).length === 0
                    this.currentPicture.multiplePeople = (<any>data).length > 1;
                    if (!this.currentPicture.noPeople && !this.currentPicture.multiplePeople) {
                        this.currentPicture.anger =(<any>data[0]).faceAttributes.emotion.anger;
                        this.currentPicture.contempt = (<any>data[0]).faceAttributes.emotion.contempt;
                        this.currentPicture.disgust = (<any>data[0]).faceAttributes.emotion.disgust;
                        this.currentPicture.sadness = (<any>data[0]).faceAttributes.emotion.sadness;
                        this.currentPicture.surprise = (<any>data[0]).faceAttributes.emotion.surprise;
                        this.currentPicture.fear = (<any>data[0]).faceAttributes.emotion.fear;
                        
                        this.currentPicture.glasses = (<any>data[0]).faceAttributes.glasses;

                        this.currentPicture.exposure = (<any>data[0]).faceAttributes.exposure.exposureLevel;
                        this.currentPicture.blur = (<any>data[0]).faceAttributes.blur.blurLevel;
                        this.currentPicture.noise = (<any>data[0]).faceAttributes.noise.noiseLevel;

                        this.currentPicture.smile = (<any>data[0]).faceAttributes.smile;
                      }
                      console.log(data);

                      if (this.currentPicture.noPeople) {
        this.output = this.output + "\nFace can't be detected."
      } else {
      if (this.currentPicture.multiplePeople) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nThere are multiple people in the picture."
      } else {
      if (this.currentPicture.logo) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nThere's a company logo in the picture."
      }
      if (!this.currentPicture.smile) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nYou're not smiling:("
      }
      if (this.currentPicture.blur !== "low") {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nBlurry picture."
      }
      if (this.currentPicture.anger > 0.1) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nYour expression resembles anger."
      }
      if (this.currentPicture.contempt > 0.1) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nYour expression resembles contempt."
      }
      if (this.currentPicture.fear > 0.1) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nYour expression resembles fear."
      }
      if (this.currentPicture.sadness > 0.1) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nYour expression resembles sadness."
      }
      if (this.currentPicture.disgust > 0.1) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nYour expression resembles disgust"
      }
      if (this.currentPicture.surprise > 0.1) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nYour expression resembles surprise"
      }
      if (this.currentPicture.sunglasses > 0.1) {
        this.outputPicture = "./assets/img/checkmark.png"
        this.output = this.output + "\nAvoid sunglasses."
      }

      if (data!= "" && this.output == "" || this.output == "\n") {
        this.output = "Great job!"
      }
    }
  }
                    },
                    error => {
                      console.error("Error with FaceAPI");
                    }
                );
              },
              error => {
                console.error("Error with Google API, Logo Detection");
              }
            );
        },
        error => {
          console.error("Error with Google API, Label Detection");
        }
      );
      return true;
  }

  title = 'app';
  ngOnInit() {
    
  }
}
 