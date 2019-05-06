import React, { Component } from 'react'
import * as d3 from 'd3'

import Highlight from 'react-highlight'
import styled from 'styled-components'
import { Modal, Button, Card } from 'react-bootstrap'

import './style.css'

const HighlightWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

class BinaryTree extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      code: {
        show: false
      },
      experiments: {
        show: false
      }
    };
  }

  handleClose(name) {
    this.setState({ [name]: { show: false }});
  }

  handleShow(name) {
    this.setState({ [name]: { show: true }});
  }

  componentDidMount = () => {
    class Node {
      constructor(value){
          this.value = value;
          this.parent = null;
          this.left = null;
          this.right = null;
      }
  }
  
  class BinarySearchTree {
      constructor(node){
          this.root = node;
      }
      
      // Insert Node
      insert(node, root){
          if (node.value == root.value){
              return ;
          }
          else if(node.value < root.value){
              // check if left subtree is null
              if (root.left != null){
                  this.insert(node, root.left);  
              }
              else{
                  root.left = node;
                  node.parent = root;
              }
          } else {
              // check if right subtree is null
              if (root.right != null){
                  this.insert(node, root.right); 
              }
              else{
                  root.right = node; 
                  node.parent = root;
              }
          }    
      }
  }
  
  function myXOR(a,b) {
      return ( a || b ) && !( a && b );
  }
  
  // Main Program
  (function(){
      var numbers = [4,3,6,9,7,8,15];
  
      var node = new Node(7);
      var tree = new BinarySearchTree(node);
  
      for (i in numbers){
          tree.insert(new Node(numbers[i]), tree.root);
      }    
      
      // Set dimensions and margins for diagram
      var margin = {top: 40, bottom: 80},
          width = 400,
          height = 400 - margin.top - margin.bottom;
  
      // append the svg object to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin   
      var svg = d3.select("#binary").append("svg")
          // .attr("width", "100%")
          .attr("height", height + margin.top + margin.bottom)
          .attr("viewBox","0 0 400 400")
          .append("g")
          .attr("transform", "translate(0," + margin.top + ")");
                      
      var i = 0,      
          duration = 750,
          root;
  
      // Declares a tree layout and assigns the size
      var treemap = d3.tree().size([width, height]);
  
      // Assigns parent, children, height, depth, and coordinates
      root = d3.hierarchy(tree.root, function(d){
  
          d.children=[];
          if (d.left){
              d.children.push(d.left);
              if (myXOR(d.left, d.right)){
                  d.children.push(new Node("e"));
              }
          }
          if (d.right){
              if (myXOR(d.left, d.right)){
                  d.children.push(new Node("e"));
              }
              d.children.push(d.right);
          }
          return d.children; 
      });
      
    
      root.x0 = width / 2;
      root.y0 = 0;
  
      // Collapse after the second level
      // root.children.forEach(collapse);
  
      update(root);
  
      // Collapse the node and all it's children
      function collapse(d){
          if(d.children){
              d._children = d.children
              d._children.forEach(collapse)
              d.children = null;
          }
      }
  
      // Update
      function update(source){
          // Assigns the x and y position for the nodes
          var treeData = treemap(root);
          
          // Compute the new tree layout.
          var nodes = treeData.descendants(),
              links = treeData.descendants().slice(1);
              
          // Normalize for fixed-depth
          nodes.forEach(function(d){ d.y = d.depth*100 });    
          
          // **************** Nodes Section ****************
          
          // Update the nodes...
          var node = svg.selectAll('g.node')
               .data(nodes, function(d) {return d.id || (d.id = ++i); });
               
          // Enter any new nodes at the parent's previous position.
          var nodeEnter = node.enter().append('g')
                           .attr('class', 'node')
                           .attr("transform", function(d){
                               return "translate(" + source.x0 + "," + source.y0 + ")";
                           })
                           .on('click', click);
                           
          // Add Circle for the nodes
          nodeEnter.append('circle')
              .attr('class', function(d) {
                if (isNaN(d.value)) {
                  return "node hidden";
                }
                  return 'node';
              })
              .attr('r', 1e-6)
              .style("fill", function(d){
                  return d._children ? "lightsteelblue" : "#fff";
              });
          
          // Add labels for the nodes
          nodeEnter.append('text')
              .attr("dy", ".35em")
              .attr("x", function(d){
                  return d.children || d._children ? -13 : 13;
              })
              .attr("text-anchor", function(d){
                  return d.children || d._children ? "end" : "start";
              })
              .text(function(d){ return d.data.value; });
          
          // Update
          var nodeUpdate = nodeEnter.merge(node);
          
          // Transition to the proper position for the nodes
          nodeUpdate.transition()
              .duration(duration)
              .attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
              });
          
          // Update the node attributes and style
          nodeUpdate.select('circle.node')
              .attr('r', 10)
              .style("fill", function(d){
                  return d._children ? "lightsteelblue" : "#fff";
              })
              .attr('cursor', 'pointer');
              
          // Remove any exiting nodes
          var nodeExit = node.exit().transition()
              .duration(duration)
              .attr("transform", function(d){
                  return "translate(" + source.x +","+ source.y +")";
              })
              .remove();
              
          // On exit reduce the node circles size to 0
          nodeExit.select('circle')
              .attr('r', 1e-6);
          
          // On exit reduce the opacity of text lables  
          nodeExit.select('text')
              .style('fill-opacity', 1e-6)
              
          // **************** Links Section ****************
          
          // Update the links...
          var link = svg.selectAll('path.link')
              .data(links, function(d){ return d.id; });
              
          // Enter any new links at the parent's previous position
          var linkEnter = link.enter().insert('path', "g")
              .attr("class", function(d) {
                  if (isNaN(d.value)) {
                      return "link hidden "
                  }
                  return "link";
              })
              .attr('d', function(d){
                  var o = {x: source.x0, y: source.y0};
                  return diagonal(o,o);
              });
          
          // Update
          var linkUpdate = linkEnter.merge(link);
          
          // Transition back to the parent element position
          linkUpdate.transition()
              .duration(duration)
              .attr('d', function(d){ return diagonal(d, d.parent) });
          
          // Remove any existing links
          var linkExit = link.exit().transition()
                  .duration(duration)
                  .attr('d', function(d){
                      var o = {x: source.x, y: source.y};
                  })
                  .remove();
          
          // Store the old positions for transition.
          nodes.forEach(function(d){
              d.x0 = d.x;
              d.y0 = d.y;
          });
          
          // Create a curved (diagonal) path from parent to the child nodes
          function diagonal(s,d){
              let path = `M ${s.x} ${s.y}
              C ${(s.x + d.x) / 2} ${s.y},
                ${(s.x + d.x) / 2} ${d.y},
                ${d.x} ${d.y}`
  
              return path;
          }
  
          // Toggle children on click
          function click(d){
              if (d.children){
                  d._children = d.children;
                  d.children = null;
              }
              else{
                  d.children = d._children;
                  d._children = null;
              }
              update(d);
          }
      }
      
  })()
    
  }

  render() {
    return (
        <Card style={{ width: '450px'}}> 
          <Card.Header><h1>Binary Search Tree</h1></Card.Header>
          <Card.Body>
            <Card.Title>What is it?</Card.Title>
            <Card.Text>
            In computer science, binary search trees (BST), are data structures that store "items" (such as numbers, names etc.) in memory. They allow fast lookup, addition and removal of items, and can be used to implement either dynamic sets of items, or lookup tables that allow finding an item by its key. (e.g., finding the phone number of a person by name).

            </Card.Text>

            <Card.Title>Interactive Animation</Card.Title>
            <div id="binary"></div>

            <>
        <Button variant="primary" onClick={()=> this.handleShow("code")}>
          Sample Code
        </Button>

        <Modal size="lg" show={this.state.code.show} onHide={() => this.handleClose("code")}>
          <Modal.Header closeButton>
            <Modal.Title>Sample Code Implementation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <HighlightWrapper>
              <Highlight innerHTML={true}>{'<h3>Sample Code Implementation</h3>'}</Highlight>
              <Highlight language="javascript">
                {`

               
                `}
              </Highlight>
            </HighlightWrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=> this.handleClose("code")}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>

          </Card.Body>
        </Card>
    );
  }
}

export default BinaryTree