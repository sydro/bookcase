"use strict";

import * as React from "react";
import fetch from "isomorphic-fetch";
import Quagga from "quagga";
import { browserHistory } from "react-router";

class Barcode extends React.Component {
  handleFound(code) {
    browserHistory.push("/search/" + code);
  }

  componentDidMount() {
    let father = this;
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#scanner-container"),
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          },
          area: {
            top: "0%",
            right: "0%",
            left: "0%",
            bottom: "0%"
          }
        },
        decoder: {
          readers: ["ean_reader"],
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true
            }
          }
        }
      },
      function(err) {
        if (err) {
          console.log(err);
          return;
        }
        //console.log("Initialization finished. Ready to start");
        Quagga.start();

        Quagga.onProcessed(function(result) {
          var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

          if (result) {
            if (result.boxes) {
              drawingCtx.clearRect(
                0,
                0,
                parseInt(drawingCanvas.getAttribute("width")),
                parseInt(drawingCanvas.getAttribute("height"))
              );
              result.boxes
                .filter(function(box) {
                  return box !== result.box;
                })
                .forEach(function(box) {
                  Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                    color: "green",
                    lineWidth: 2
                  });
                });
            }

            if (result.box) {
              Quagga.ImageDebug.drawPath(
                result.box,
                { x: 0, y: 1 },
                drawingCtx,
                { color: "#00F", lineWidth: 2 }
              );
            }

            if (result.codeResult && result.codeResult.code) {
              Quagga.ImageDebug.drawPath(
                result.line,
                { x: "x", y: "y" },
                drawingCtx,
                { color: "red", lineWidth: 3 }
              );
            }
          }
        }); //Quagga.onProcessed

        Quagga.onDetected(function(result) {
          //console.log("Barcode detected and processed : [" + result.codeResult.code + "]",result);
          Quagga.stop();
          father.handleFound(result.codeResult.code);
        });
      } //function(err)
    );
  }

  render() {
    return (
      <div className="account-container">
        <div>
          <h1>Search by Barcode</h1>
        </div>
        <div id="scanner-container" style={{ position: "relative" }} />
      </div>
    );
  }
}

export default Barcode;
