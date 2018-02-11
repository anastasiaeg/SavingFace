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
  picture = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg'
  constructor(private http:HttpClient) {}
  // Uses http.get() to load data from a single API endpoint
  sendPicture() {
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
          console.log(data);
        },
        error => {
          console.error("Error with Google API, Label Detection");
        }
      );
    this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBna2198cL3Z8t2grEH1czQHo8CGw6c_w0", logoDetection, {
      headers:{'Content-Type': 'application/json'}
    }).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.error("Error with Google API, Logo Detection");
        }
      );
    this.http.post('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect','{"url" : ' + '"' + this.picture + '"}' , {
        headers:{'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': '0f7ed84a8e4e4642b20cf0cbdfdeb443'},
        params: {"returnFaceId": "true", "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"}
      }).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.error("Error with FaceAPI");
        }
      );
      return true;
  }

  title = 'app';
  ngOnInit() {
    
  }
}
 