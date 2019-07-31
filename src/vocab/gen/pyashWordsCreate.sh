#!/bin/bash
{
cat gramWords-mega.txt #  |sed -e 's/$/_GRAMMAR/' > pyashWords.txt
cat rootWords-mega.txt # |sed -e 's/$/_WORD/' >> pyashWords.txt
} > pyashWords.txt
