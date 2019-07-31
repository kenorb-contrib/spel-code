#define __CL_ENABLE_EXCEPTIONS
 
#include <fstream>
#include <iostream>
#include <iterator>
#include <CL/cl.hpp>
#include <CL/opencl.h>
 
using namespace std;

__kernel void hello_world (__global char* message, int
messageSize) {
	for (int i =0; i < messageSize; i++) {
		printf("%s", message[i]);
	}
}
 
int main () {
 
    vector<cl::Platform> platforms;
    vector<cl::Device> devices;
    vector<cl::Kernel> kernels;
     
    try {
     
        // create platform
        cl::Platform::get(&platforms);
        platforms[0].getDevices(CL_DEVICE_TYPE_GPU, &devices);
 
        // create context
        cl::Context context(devices);
 
        // create command queue
        cl::CommandQueue queue(context, devices[0]);
 
        // load opencl source
        ifstream cl_file("opencl_hello_world.cl");
        string cl_string(istreambuf_iterator<char>(cl_file),
(istreambuf_iterator<char>()));
        cl::Program::Sources source(1,
make_pair(cl_string.c_str(), 
            cl_string.length() + 1));
 
        // create program
        cl::Program program(context, source);
 
        // compile opencl source
        program.build(devices);
 
        // load named kernel from opencl source
        cl::Kernel kernel(program, "hello_world");
 
        // create a message to send to kernel
        char* message = "Hello World!";
        int messageSize = 12;
 
        // allocate device buffer to hold message
        cl::Buffer buffer(CL_MEM_READ_ONLY |
CL_MEM_COPY_HOST_PTR, 
            sizeof(char) * messageSize, message);
 
        // set message as kernel argument
        kernel.setArg(0, buffer);
        kernel.setArg(1, sizeof(int), &messageSize);
 
        // execute kernel
        queue.enqueueTask(kernel);
 
        // wait for completion
        queue.finish();
 
        cout << endl;
         
    } catch (cl::Error e) {
        cout << endl << e.what() << " : " << e.err() << endl;
    }
     
    return 0;
     
}
