; ModuleID = 'lank-vm.cpp'
target datalayout = "e-p:32:32:32-i1:8:8-i8:8:8-i16:16:16-i32:32:32-i64:64:64-f32:32:32-f64:64:64-v64:64:64-v128:64:128-a0:0:64-n32-S64"
target triple = "armv6-unknown-linux-gnueabihf"

%struct._IO_FILE = type { i32, i8*, i8*, i8*, i8*, i8*, i8*, i8*, i8*, i8*, i8*, i8*, %struct._IO_marker*, %struct._IO_FILE*, i32, i32, i32, i16, i8, [1 x i8], i8*, i64, i8*, i8*, i8*, i8*, i32, i32, [40 x i8] }
%struct._IO_marker = type { %struct._IO_marker*, %struct._IO_FILE*, i32 }

@.str = private unnamed_addr constant [43 x i8] c"memory[0x20+1+0] <= (uint32_t) 0xFFFFFFFFU\00", align 1
@.str1 = private unnamed_addr constant [12 x i8] c"lank-vm.cpp\00", align 1
@__PRETTY_FUNCTION__.run = private unnamed_addr constant [53 x i8] c"void run(const size_t, const uint32_t *, uint32_t *)\00", align 1
@.str2 = private unnamed_addr constant [16 x i8] c"PC %X INSTR %X\0A\00", align 1
@.str3 = private unnamed_addr constant [4 x i8] c"%s\0A\00", align 1
@_ZZ4mainE4prog = private unnamed_addr constant [10 x i32] [i32 294, i32 -1688681770, i32 1010303076, i32 -1688681770, i32 976748744, i32 875348282, i32 -1688681770, i32 1496842424, i32 875350100, i32 875340433], align 4
@.str4 = private unnamed_addr constant [8 x i8] c"test.lc\00", align 1
@.str5 = private unnamed_addr constant [2 x i8] c"r\00", align 1
@.str6 = private unnamed_addr constant [8 x i8] c"test.lt\00", align 1
@.str7 = private unnamed_addr constant [2 x i8] c"w\00", align 1
@.str8 = private unnamed_addr constant [21 x i8] c"sourceCode != __null\00", align 1
@__PRETTY_FUNCTION__.main = private unnamed_addr constant [11 x i8] c"int main()\00", align 1
@.str9 = private unnamed_addr constant [20 x i8] c"tokenFile != __null\00", align 1
@.str10 = private unnamed_addr constant [25 x i8] c"sourceSentenceLength > 0\00", align 1
@.str11 = private unnamed_addr constant [44 x i8] c"(size_t) returnCode == outputSentenceLength\00", align 1
@.str12 = private unnamed_addr constant [16 x i8] c"returnCode == 0\00", align 1
@.str13 = private unnamed_addr constant [15 x i8] c"progLength > 0\00", align 1
@_ZZ8tokenizejPcPjPtE6glyphs = private unnamed_addr constant [6 x i8] c"XXXXX\00", align 1
@__PRETTY_FUNCTION__._Z8tokenizejPcPjPt = private unnamed_addr constant [58 x i8] c"void tokenize(const size_t, char *, size_t *, uint16_t *)\00", align 1
@.str14 = private unnamed_addr constant [25 x i8] c"sourceSentence != __null\00", align 1
@.str15 = private unnamed_addr constant [30 x i8] c"tokenSentenceLength != __null\00", align 1
@.str16 = private unnamed_addr constant [24 x i8] c"tokenSentence != __null\00", align 1
@.str17 = private unnamed_addr constant [18 x i8] c"prevToken 0x%X \0A \00", align 1
@.str18 = private unnamed_addr constant [15 x i8] c"n0 glyph '%c' \00", align 1
@.str19 = private unnamed_addr constant [11 x i8] c"nibble %X \00", align 1
@.str20 = private unnamed_addr constant [14 x i8] c"at %d  in %s\0A\00", align 1
@.str21 = private unnamed_addr constant [38 x i8] c"tokenization parse error, vowel start\00", align 1
@.str22 = private unnamed_addr constant [18 x i8] c"nibbles[0] <= 0xC\00", align 1
@.str23 = private unnamed_addr constant [41 x i8] c"tempSourceIndex+3 < sourceSentenceLength\00", align 1
@.str24 = private unnamed_addr constant [18 x i8] c"%c at %d from %s\0A\00", align 1
@.str25 = private unnamed_addr constant [26 x i8] c"tokenize unexpected space\00", align 1
@.str26 = private unnamed_addr constant [20 x i8] c"!isSpace(glyphs[1])\00", align 1
@.str27 = private unnamed_addr constant [20 x i8] c"!isSpace(glyphs[3])\00", align 1
@.str28 = private unnamed_addr constant [19 x i8] c"tokenIndex <= 60/2\00", align 1
@.str29 = private unnamed_addr constant [18 x i8] c"memory[0x20] == 1\00", align 1
@__PRETTY_FUNCTION__._Z4evalPjPb = private unnamed_addr constant [30 x i8] c"void eval(uint32_t *, bool *)\00", align 1
@.str30 = private unnamed_addr constant [13 x i8] c"command != 0\00", align 1
@.str31 = private unnamed_addr constant [6 x i8] c"exit\0A\00", align 1
@.str32 = private unnamed_addr constant [37 x i8] c"memory[0x10+0x5] == memory[0x10+0xA]\00", align 1
@.str33 = private unnamed_addr constant [7 x i8] c"added\0A\00", align 1
@.str34 = private unnamed_addr constant [37 x i8] c"memory[0x10+0x6] == memory[0x10+0xA]\00", align 1
@.str35 = private unnamed_addr constant [12 x i8] c"subtracted\0A\00", align 1
@.str36 = private unnamed_addr constant [22 x i8] c"eval: unknown command\00", align 1
@.str37 = private unnamed_addr constant [17 x i8] c"memory != __null\00", align 1
@__PRETTY_FUNCTION__._Z9printRegsPKj = private unnamed_addr constant [33 x i8] c"void printRegs(const uint32_t *)\00", align 1
@.str38 = private unnamed_addr constant [13 x i8] c"registers: \0A\00", align 1
@.str39 = private unnamed_addr constant [19 x i8] c"      Value\09Type \0A\00", align 1
@.str40 = private unnamed_addr constant [18 x i8] c" IMM    %d\090x%X,\0A\00", align 1
@.str41 = private unnamed_addr constant [18 x i8] c" HEY    %d\090x%X,\0A\00", align 1
@.str42 = private unnamed_addr constant [18 x i8] c" ABOUT  %d\090x%X,\0A\00", align 1
@.str43 = private unnamed_addr constant [18 x i8] c" SU     %d\090x%X,\0A\00", align 1
@.str44 = private unnamed_addr constant [18 x i8] c" OF     %d\090x%X,\0A\00", align 1
@.str45 = private unnamed_addr constant [18 x i8] c" TO     %d\090x%X,\0A\00", align 1
@.str46 = private unnamed_addr constant [18 x i8] c" FROM   %d\090x%X,\0A\00", align 1
@.str47 = private unnamed_addr constant [18 x i8] c" BY     %d\090x%X,\0A\00", align 1
@.str48 = private unnamed_addr constant [18 x i8] c" BE     %d\090x%X,\0A\00", align 1
@.str49 = private unnamed_addr constant [18 x i8] c" OB     %d\090x%X,\0A\00", align 1
@.str50 = private unnamed_addr constant [18 x i8] c" DATAP  %d\090x%X,\0A\00", align 1
@.str51 = private unnamed_addr constant [18 x i8] c" STACKP %d\090x%X,\0A\00", align 1
@.str52 = private unnamed_addr constant [18 x i8] c" PC     %d\090x%X,\0A\00", align 1
@.str53 = private unnamed_addr constant [18 x i8] c"printedLength > 0\00", align 1
@__PRETTY_FUNCTION__._Z21memPhraseToLankGlyphsPKjjPc = private unnamed_addr constant [67 x i8] c"void memPhraseToLankGlyphs(const uint32_t *, const size_t, char *)\00", align 1
@.str54 = private unnamed_addr constant [17 x i8] c"glyphs != __null\00", align 1
@.str55 = private unnamed_addr constant [17 x i8] c"phraseLength > 0\00", align 1
@.str56 = private unnamed_addr constant [40 x i8] c"phraseLength <= (size_t) (uint32_t) 0xF\00", align 1
@.str57 = private unnamed_addr constant [17 x i8] c"memory[0x20] > 1\00", align 1
@__PRETTY_FUNCTION__._Z6decodePj = private unnamed_addr constant [24 x i8] c"void decode(uint32_t *)\00", align 1
@.str58 = private unnamed_addr constant [24 x i8] c"immediateLengthWord > 0\00", align 1
@.str59 = private unnamed_addr constant [30 x i8] c"0xFFFF >= immediateLengthWord\00", align 1
@.str60 = private unnamed_addr constant [41 x i8] c"immediateValue <= (uint32_t) 0xFFFFFFFFU\00", align 1
@.str61 = private unnamed_addr constant [36 x i8] c"decode: unknown immediateLengthWord\00", align 1
@.str62 = private unnamed_addr constant [33 x i8] c"phraseDecode: unknown phraseWord\00", align 1
@__PRETTY_FUNCTION__._Z5fetchPKjjPj = private unnamed_addr constant [55 x i8] c"void fetch(const uint32_t *, const size_t, uint32_t *)\00", align 1
@.str63 = private unnamed_addr constant [27 x i8] c"PC exceeded end of program\00", align 1
@.str64 = private unnamed_addr constant [25 x i8] c"memory[0xF] < progLength\00", align 1
@.str65 = private unnamed_addr constant [28 x i8] c"currentBit < (uint32_t) 0xF\00", align 1
@.str66 = private unnamed_addr constant [32 x i8] c"batchIndex < (uint32_t) 0xFFFFU\00", align 1
@.str67 = private unnamed_addr constant [28 x i8] c"maxLength <= (uint32_t) 0xF\00", align 1
@.str68 = private unnamed_addr constant [32 x i8] c"memory[0x20] <= remainingLength\00", align 1
@.str69 = private unnamed_addr constant [26 x i8] c"memory[0x20] <= maxLength\00", align 1
@.str70 = private unnamed_addr constant [37 x i8] c"phraseWord <= (uint32_t) 0xFFFFFFFFU\00", align 1
@.str71 = private unnamed_addr constant [32 x i8] c"number < (uint32_t) 0xFFFFFFFFU\00", align 1
@__PRETTY_FUNCTION__._Z16amountOfSameBitsjj = private unnamed_addr constant [58 x i8] c"uint32_t amountOfSameBits(const uint32_t, const uint32_t)\00", align 1
@.str72 = private unnamed_addr constant [36 x i8] c"maxLength <= (size_t) sizeof(int)*8\00", align 1
@.str73 = private unnamed_addr constant [25 x i8] c"firstBit <= (uint32_t) 1\00", align 1
@.str74 = private unnamed_addr constant [20 x i8] c"length <= maxLength\00", align 1

define void @run(i32 %progLength, i32* %prog, i32* %memory) #0 {
  %1 = alloca i32, align 4
  %2 = alloca i32*, align 4
  %3 = alloca i32*, align 4
  %i = alloca i32, align 4
  %running = alloca i8, align 1
  %glyphsLength = alloca i32, align 4
  %glyphs = alloca [120 x i8], align 1
  store i32 %progLength, i32* %1, align 4
  store i32* %prog, i32** %2, align 4
  store i32* %memory, i32** %3, align 4
  store i32 0, i32* %i, align 4
  store i8 1, i8* %running, align 1
  store i32 0, i32* %glyphsLength, align 4
  %4 = bitcast [120 x i8]* %glyphs to i8*
  call void @llvm.memset.p0i8.i32(i8* %4, i8 0, i32 120, i32 1, i1 false)
  store i32 0, i32* %i, align 4
  br label %5

; <label>:5                                       ; preds = %47, %0
  %6 = load i32* %i, align 4
  %7 = load i32* %1, align 4
  %8 = icmp ult i32 %6, %7
  br i1 %8, label %9, label %50

; <label>:9                                       ; preds = %5
  %10 = load i32** %2, align 4
  %11 = load i32* %1, align 4
  %12 = load i32** %3, align 4
  call void @_Z5fetchPKjjPj(i32* %10, i32 %11, i32* %12)
  %13 = load i32** %3, align 4
  call void @_Z6decodePj(i32* %13)
  %14 = load i32** %3, align 4
  %15 = getelementptr inbounds i32* %14, i32 33
  %16 = load i32* %15, align 4
  %17 = icmp ule i32 %16, -1
  br i1 %17, label %18, label %19

; <label>:18                                      ; preds = %9
  br label %21

; <label>:19                                      ; preds = %9
  call void @__assert_fail(i8* getelementptr inbounds ([43 x i8]* @.str, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 332, i8* getelementptr inbounds ([53 x i8]* @__PRETTY_FUNCTION__.run, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %21

; <label>:21                                      ; preds = %20, %18
  %22 = load i32** %3, align 4
  %23 = getelementptr inbounds i32* %22, i32 15
  %24 = load i32* %23, align 4
  %25 = load i32** %3, align 4
  %26 = getelementptr inbounds i32* %25, i32 33
  %27 = load i32* %26, align 4
  %28 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([16 x i8]* @.str2, i32 0, i32 0), i32 %24, i32 %27)
  %29 = load i32** %3, align 4
  %30 = getelementptr inbounds i32* %29, i32 32
  %31 = load i32* %30, align 4
  %32 = mul i32 %31, 4
  %33 = mul i32 %32, 2
  %34 = add i32 %33, 1
  store i32 %34, i32* %glyphsLength, align 4
  %35 = load i32** %3, align 4
  %36 = load i32* %glyphsLength, align 4
  %37 = getelementptr inbounds [120 x i8]* %glyphs, i32 0, i32 0
  call void @_Z21memPhraseToLankGlyphsPKjjPc(i32* %35, i32 %36, i8* %37)
  %38 = getelementptr inbounds [120 x i8]* %glyphs, i32 0, i32 0
  %39 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([4 x i8]* @.str3, i32 0, i32 0), i8* %38)
  %40 = load i32** %3, align 4
  call void @_Z4evalPjPb(i32* %40, i8* %running)
  %41 = load i8* %running, align 1
  %42 = trunc i8 %41 to i1
  %43 = zext i1 %42 to i32
  %44 = icmp eq i32 %43, 0
  br i1 %44, label %45, label %46

; <label>:45                                      ; preds = %21
  br label %50

; <label>:46                                      ; preds = %21
  br label %47

; <label>:47                                      ; preds = %46
  %48 = load i32* %i, align 4
  %49 = add i32 %48, 1
  store i32 %49, i32* %i, align 4
  br label %5

; <label>:50                                      ; preds = %45, %5
  ret void
}

; Function Attrs: nounwind
declare void @llvm.memset.p0i8.i32(i8* nocapture, i8, i32, i32, i1) #1

define internal void @_Z5fetchPKjjPj(i32* %prog, i32 %progLength, i32* %memory) #0 {
  %1 = alloca i32*, align 4
  %2 = alloca i32, align 4
  %3 = alloca i32*, align 4
  %batchIndex = alloca i32, align 4
  %currentBit = alloca i32, align 4
  %phraseWord = alloca i32, align 4
  %maxLength = alloca i32, align 4
  %i = alloca i32, align 4
  %remainingLength = alloca i32, align 4
  store i32* %prog, i32** %1, align 4
  store i32 %progLength, i32* %2, align 4
  store i32* %memory, i32** %3, align 4
  store i32 0, i32* %batchIndex, align 4
  store i32 0, i32* %currentBit, align 4
  store i32 0, i32* %phraseWord, align 4
  store i32 15, i32* %maxLength, align 4
  store i32 0, i32* %remainingLength, align 4
  %4 = load i32** %3, align 4
  %5 = icmp ne i32* %4, null
  br i1 %5, label %6, label %7

; <label>:6                                       ; preds = %0
  br label %9

; <label>:7                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str37, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 132, i8* getelementptr inbounds ([55 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %9

; <label>:9                                       ; preds = %8, %6
  %10 = load i32** %3, align 4
  %11 = getelementptr inbounds i32* %10, i32 15
  %12 = load i32* %11, align 4
  %13 = load i32* %2, align 4
  %14 = icmp uge i32 %12, %13
  br i1 %14, label %15, label %16

; <label>:15                                      ; preds = %9
  call void @error(i8* getelementptr inbounds ([27 x i8]* @.str63, i32 0, i32 0))
  br label %16

; <label>:16                                      ; preds = %15, %9
  %17 = load i32** %3, align 4
  %18 = getelementptr inbounds i32* %17, i32 15
  %19 = load i32* %18, align 4
  %20 = load i32* %2, align 4
  %21 = icmp ult i32 %19, %20
  br i1 %21, label %22, label %23

; <label>:22                                      ; preds = %16
  br label %25

; <label>:23                                      ; preds = %16
  call void @__assert_fail(i8* getelementptr inbounds ([25 x i8]* @.str64, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 136, i8* getelementptr inbounds ([55 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %25

; <label>:25                                      ; preds = %24, %22
  %26 = load i32** %3, align 4
  %27 = getelementptr inbounds i32* %26, i32 15
  %28 = load i32* %27, align 4
  %29 = urem i32 %28, 15
  store i32 %29, i32* %currentBit, align 4
  %30 = load i32** %3, align 4
  %31 = getelementptr inbounds i32* %30, i32 15
  %32 = load i32* %31, align 4
  %33 = load i32* %currentBit, align 4
  %34 = sub i32 %32, %33
  %35 = load i32** %1, align 4
  %36 = getelementptr inbounds i32* %35, i32 %34
  %37 = load i32* %36, align 4
  store i32 %37, i32* %batchIndex, align 4
  %38 = load i32* %currentBit, align 4
  %39 = icmp eq i32 %38, 0
  br i1 %39, label %40, label %49

; <label>:40                                      ; preds = %25
  %41 = load i32** %3, align 4
  %42 = getelementptr inbounds i32* %41, i32 15
  %43 = load i32* %42, align 4
  %44 = add i32 %43, 1
  %45 = load i32** %3, align 4
  %46 = getelementptr inbounds i32* %45, i32 15
  store i32 %44, i32* %46, align 4
  %47 = load i32* %currentBit, align 4
  %48 = add i32 %47, 1
  store i32 %48, i32* %currentBit, align 4
  br label %49

; <label>:49                                      ; preds = %40, %25
  %50 = load i32* %currentBit, align 4
  %51 = icmp ult i32 %50, 15
  br i1 %51, label %52, label %53

; <label>:52                                      ; preds = %49
  br label %55

; <label>:53                                      ; preds = %49
  call void @__assert_fail(i8* getelementptr inbounds ([28 x i8]* @.str65, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 144, i8* getelementptr inbounds ([55 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %55

; <label>:55                                      ; preds = %54, %52
  %56 = load i32* %batchIndex, align 4
  %57 = load i32* %currentBit, align 4
  %58 = lshr i32 %56, %57
  store i32 %58, i32* %batchIndex, align 4
  %59 = load i32* %batchIndex, align 4
  %60 = icmp ult i32 %59, 65535
  br i1 %60, label %61, label %62

; <label>:61                                      ; preds = %55
  br label %64

; <label>:62                                      ; preds = %55
  call void @__assert_fail(i8* getelementptr inbounds ([32 x i8]* @.str66, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 146, i8* getelementptr inbounds ([55 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %64

; <label>:64                                      ; preds = %63, %61
  %65 = load i32* %2, align 4
  %66 = load i32** %3, align 4
  %67 = getelementptr inbounds i32* %66, i32 15
  %68 = load i32* %67, align 4
  %69 = sub i32 %65, %68
  store i32 %69, i32* %remainingLength, align 4
  %70 = load i32* %remainingLength, align 4
  %71 = icmp ult i32 %70, 15
  br i1 %71, label %72, label %77

; <label>:72                                      ; preds = %64
  %73 = load i32* %2, align 4
  %74 = urem i32 %73, 14
  %75 = load i32* %currentBit, align 4
  %76 = sub i32 %74, %75
  store i32 %76, i32* %maxLength, align 4
  br label %80

; <label>:77                                      ; preds = %64
  %78 = load i32* %currentBit, align 4
  %79 = sub i32 15, %78
  store i32 %79, i32* %maxLength, align 4
  br label %80

; <label>:80                                      ; preds = %77, %72
  %81 = load i32* %maxLength, align 4
  %82 = icmp ule i32 %81, 15
  br i1 %82, label %83, label %84

; <label>:83                                      ; preds = %80
  br label %86

; <label>:84                                      ; preds = %80
  call void @__assert_fail(i8* getelementptr inbounds ([28 x i8]* @.str67, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 153, i8* getelementptr inbounds ([55 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %86

; <label>:86                                      ; preds = %85, %83
  %87 = load i32* %batchIndex, align 4
  %88 = load i32* %maxLength, align 4
  %89 = call i32 @_Z16amountOfSameBitsjj(i32 %87, i32 %88)
  %90 = load i32** %3, align 4
  %91 = getelementptr inbounds i32* %90, i32 32
  store i32 %89, i32* %91, align 4
  %92 = load i32** %3, align 4
  %93 = getelementptr inbounds i32* %92, i32 32
  %94 = load i32* %93, align 4
  %95 = load i32* %remainingLength, align 4
  %96 = icmp ule i32 %94, %95
  br i1 %96, label %97, label %98

; <label>:97                                      ; preds = %86
  br label %100

; <label>:98                                      ; preds = %86
  call void @__assert_fail(i8* getelementptr inbounds ([32 x i8]* @.str68, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 155, i8* getelementptr inbounds ([55 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %100

; <label>:100                                     ; preds = %99, %97
  %101 = load i32** %3, align 4
  %102 = getelementptr inbounds i32* %101, i32 32
  %103 = load i32* %102, align 4
  %104 = load i32* %maxLength, align 4
  %105 = icmp ule i32 %103, %104
  br i1 %105, label %106, label %107

; <label>:106                                     ; preds = %100
  br label %109

; <label>:107                                     ; preds = %100
  call void @__assert_fail(i8* getelementptr inbounds ([26 x i8]* @.str69, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 156, i8* getelementptr inbounds ([55 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %109

; <label>:109                                     ; preds = %108, %106
  store i32 0, i32* %i, align 4
  br label %110

; <label>:110                                     ; preds = %141, %109
  %111 = load i32* %i, align 4
  %112 = load i32** %3, align 4
  %113 = getelementptr inbounds i32* %112, i32 32
  %114 = load i32* %113, align 4
  %115 = icmp ult i32 %111, %114
  br i1 %115, label %116, label %144

; <label>:116                                     ; preds = %110
  %117 = load i32** %3, align 4
  %118 = getelementptr inbounds i32* %117, i32 15
  %119 = load i32* %118, align 4
  %120 = add i32 %119, 1
  %121 = load i32** %3, align 4
  %122 = getelementptr inbounds i32* %121, i32 15
  store i32 %120, i32* %122, align 4
  %123 = load i32** %3, align 4
  %124 = getelementptr inbounds i32* %123, i32 15
  %125 = load i32* %124, align 4
  %126 = sub i32 %125, 1
  %127 = load i32** %1, align 4
  %128 = getelementptr inbounds i32* %127, i32 %126
  %129 = load i32* %128, align 4
  store i32 %129, i32* %phraseWord, align 4
  %130 = load i32* %phraseWord, align 4
  %131 = icmp ule i32 %130, -1
  br i1 %131, label %132, label %133

; <label>:132                                     ; preds = %116
  br label %135

; <label>:133                                     ; preds = %116
  call void @__assert_fail(i8* getelementptr inbounds ([37 x i8]* @.str70, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 160, i8* getelementptr inbounds ([55 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %135

; <label>:135                                     ; preds = %134, %132
  %136 = load i32* %phraseWord, align 4
  %137 = load i32* %i, align 4
  %138 = add i32 33, %137
  %139 = load i32** %3, align 4
  %140 = getelementptr inbounds i32* %139, i32 %138
  store i32 %136, i32* %140, align 4
  br label %141

; <label>:141                                     ; preds = %135
  %142 = load i32* %i, align 4
  %143 = add i32 %142, 1
  store i32 %143, i32* %i, align 4
  br label %110

; <label>:144                                     ; preds = %110
  ret void
}

define internal void @_Z6decodePj(i32* %memory) #0 {
  %1 = alloca i32*, align 4
  %immediateValue = alloca i32, align 4
  %immediateLengthWord = alloca i32, align 4
  %phraseWord = alloca i32, align 4
  %typeWord = alloca i16, align 2
  store i32* %memory, i32** %1, align 4
  store i32 0, i32* %immediateValue, align 4
  store i32 0, i32* %immediateLengthWord, align 4
  store i32 0, i32* %phraseWord, align 4
  store i16 0, i16* %typeWord, align 2
  %2 = load i32** %1, align 4
  %3 = getelementptr inbounds i32* %2, i32 33
  %4 = load i32* %3, align 4
  %5 = and i32 %4, 49878
  %6 = icmp eq i32 %5, 49878
  br i1 %6, label %7, label %61

; <label>:7                                       ; preds = %0
  %8 = load i32** %1, align 4
  %9 = getelementptr inbounds i32* %8, i32 32
  %10 = load i32* %9, align 4
  %11 = icmp ugt i32 %10, 1
  br i1 %11, label %12, label %13

; <label>:12                                      ; preds = %7
  br label %15

; <label>:13                                      ; preds = %7
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str57, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 263, i8* getelementptr inbounds ([24 x i8]* @__PRETTY_FUNCTION__._Z6decodePj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %15

; <label>:15                                      ; preds = %14, %12
  %16 = load i32** %1, align 4
  %17 = getelementptr inbounds i32* %16, i32 33
  %18 = load i32* %17, align 4
  %19 = and i32 %18, -65536
  %20 = lshr i32 %19, 16
  store i32 %20, i32* %immediateLengthWord, align 4
  %21 = load i32* %immediateLengthWord, align 4
  %22 = icmp ugt i32 %21, 0
  br i1 %22, label %23, label %24

; <label>:23                                      ; preds = %15
  br label %26

; <label>:24                                      ; preds = %15
  call void @__assert_fail(i8* getelementptr inbounds ([24 x i8]* @.str58, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 266, i8* getelementptr inbounds ([24 x i8]* @__PRETTY_FUNCTION__._Z6decodePj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %26

; <label>:26                                      ; preds = %25, %23
  %27 = load i32* %immediateLengthWord, align 4
  %28 = icmp uge i32 65535, %27
  br i1 %28, label %29, label %30

; <label>:29                                      ; preds = %26
  br label %32

; <label>:30                                      ; preds = %26
  call void @__assert_fail(i8* getelementptr inbounds ([30 x i8]* @.str59, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 267, i8* getelementptr inbounds ([24 x i8]* @__PRETTY_FUNCTION__._Z6decodePj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %32

; <label>:32                                      ; preds = %31, %29
  %33 = load i32* %immediateLengthWord, align 4
  switch i32 %33, label %59 [
    i32 39768, label %34
  ]

; <label>:34                                      ; preds = %32
  %35 = load i32** %1, align 4
  %36 = getelementptr inbounds i32* %35, i32 34
  %37 = load i32* %36, align 4
  %38 = and i32 %37, 65535
  store i32 %38, i32* %immediateValue, align 4
  %39 = load i32* %immediateValue, align 4
  %40 = icmp ule i32 %39, -1
  br i1 %40, label %41, label %42

; <label>:41                                      ; preds = %34
  br label %44

; <label>:42                                      ; preds = %34
  call void @__assert_fail(i8* getelementptr inbounds ([41 x i8]* @.str60, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 272, i8* getelementptr inbounds ([24 x i8]* @__PRETTY_FUNCTION__._Z6decodePj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %44

; <label>:44                                      ; preds = %43, %41
  %45 = load i32* %immediateValue, align 4
  %46 = load i32** %1, align 4
  %47 = getelementptr inbounds i32* %46, i32 0
  store i32 %45, i32* %47, align 4
  %48 = load i32** %1, align 4
  %49 = getelementptr inbounds i32* %48, i32 34
  %50 = load i32* %49, align 4
  %51 = and i32 %50, -16777216
  %52 = lshr i32 %51, 24
  store i32 %52, i32* %phraseWord, align 4
  %53 = load i32** %1, align 4
  %54 = getelementptr inbounds i32* %53, i32 34
  %55 = load i32* %54, align 4
  %56 = and i32 %55, 16711680
  %57 = lshr i32 %56, 16
  %58 = trunc i32 %57 to i16
  store i16 %58, i16* %typeWord, align 2
  br label %60

; <label>:59                                      ; preds = %32
  call void @error(i8* getelementptr inbounds ([36 x i8]* @.str61, i32 0, i32 0))
  br label %60

; <label>:60                                      ; preds = %59, %44
  br label %61

; <label>:61                                      ; preds = %60, %0
  %62 = load i32* %phraseWord, align 4
  %63 = load i16* %typeWord, align 2
  %64 = load i32** %1, align 4
  call void @_Z12phraseDecodejtPj(i32 %62, i16 zeroext %63, i32* %64)
  ret void
}

; Function Attrs: noreturn nounwind
declare void @__assert_fail(i8*, i8*, i32, i8*) #2

declare i32 @printf(i8*, ...) #0

define internal void @_Z21memPhraseToLankGlyphsPKjjPc(i32* %memory, i32 %glyphArrayLength, i8* %glyphs) #0 {
  %1 = alloca i32*, align 4
  %2 = alloca i32, align 4
  %3 = alloca i8*, align 4
  %phraseLength = alloca i32, align 4
  %i = alloca i32, align 4
  store i32* %memory, i32** %1, align 4
  store i32 %glyphArrayLength, i32* %2, align 4
  store i8* %glyphs, i8** %3, align 4
  %4 = load i32** %1, align 4
  %5 = getelementptr inbounds i32* %4, i32 32
  %6 = load i32* %5, align 4
  store i32 %6, i32* %phraseLength, align 4
  store i32 0, i32* %i, align 4
  %7 = load i32** %1, align 4
  %8 = icmp ne i32* %7, null
  br i1 %8, label %9, label %10

; <label>:9                                       ; preds = %0
  br label %12

; <label>:10                                      ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str37, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 104, i8* getelementptr inbounds ([67 x i8]* @__PRETTY_FUNCTION__._Z21memPhraseToLankGlyphsPKjjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %12

; <label>:12                                      ; preds = %11, %9
  %13 = load i8** %3, align 4
  %14 = icmp ne i8* %13, null
  br i1 %14, label %15, label %16

; <label>:15                                      ; preds = %12
  br label %18

; <label>:16                                      ; preds = %12
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str54, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 105, i8* getelementptr inbounds ([67 x i8]* @__PRETTY_FUNCTION__._Z21memPhraseToLankGlyphsPKjjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %18

; <label>:18                                      ; preds = %17, %15
  %19 = load i32* %phraseLength, align 4
  %20 = icmp ugt i32 %19, 0
  br i1 %20, label %21, label %22

; <label>:21                                      ; preds = %18
  br label %24

; <label>:22                                      ; preds = %18
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str55, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 106, i8* getelementptr inbounds ([67 x i8]* @__PRETTY_FUNCTION__._Z21memPhraseToLankGlyphsPKjjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %24

; <label>:24                                      ; preds = %23, %21
  %25 = load i32* %phraseLength, align 4
  %26 = icmp ule i32 %25, 15
  br i1 %26, label %27, label %28

; <label>:27                                      ; preds = %24
  br label %30

; <label>:28                                      ; preds = %24
  call void @__assert_fail(i8* getelementptr inbounds ([40 x i8]* @.str56, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 107, i8* getelementptr inbounds ([67 x i8]* @__PRETTY_FUNCTION__._Z21memPhraseToLankGlyphsPKjjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %30

; <label>:30                                      ; preds = %29, %27
  store i32 0, i32* %i, align 4
  br label %31

; <label>:31                                      ; preds = %41, %30
  %32 = load i32* %i, align 4
  %33 = load i32* %phraseLength, align 4
  %34 = icmp ult i32 %32, %33
  br i1 %34, label %35, label %44

; <label>:35                                      ; preds = %31
  %36 = load i32* %phraseLength, align 4
  %37 = load i32** %1, align 4
  %38 = getelementptr inbounds i32* %37, i32 33
  %39 = load i32* %2, align 4
  %40 = load i8** %3, align 4
  call void @uint32ArrayToLankGlyphs(i32 %36, i32* %38, i32 %39, i8* %40)
  br label %41

; <label>:41                                      ; preds = %35
  %42 = load i32* %i, align 4
  %43 = add i32 %42, 1
  store i32 %43, i32* %i, align 4
  br label %31

; <label>:44                                      ; preds = %31
  ret void
}

define internal void @_Z4evalPjPb(i32* %memory, i8* %running) #0 {
  %1 = alloca i32*, align 4
  %2 = alloca i8*, align 4
  %command = alloca i32, align 4
  store i32* %memory, i32** %1, align 4
  store i8* %running, i8** %2, align 4
  %3 = load i32** %1, align 4
  %4 = getelementptr inbounds i32* %3, i32 33
  %5 = load i32* %4, align 4
  %6 = and i32 %5, 875298816
  %7 = icmp eq i32 %6, 875298816
  br i1 %7, label %8, label %83

; <label>:8                                       ; preds = %0
  %9 = load i32** %1, align 4
  %10 = getelementptr inbounds i32* %9, i32 32
  %11 = load i32* %10, align 4
  %12 = icmp eq i32 %11, 1
  br i1 %12, label %13, label %14

; <label>:13                                      ; preds = %8
  br label %16

; <label>:14                                      ; preds = %8
  call void @__assert_fail(i8* getelementptr inbounds ([18 x i8]* @.str29, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 294, i8* getelementptr inbounds ([30 x i8]* @__PRETTY_FUNCTION__._Z4evalPjPb, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %16

; <label>:16                                      ; preds = %15, %13
  %17 = load i32** %1, align 4
  %18 = getelementptr inbounds i32* %17, i32 33
  %19 = load i32* %18, align 4
  %20 = and i32 %19, 65535
  store i32 %20, i32* %command, align 4
  %21 = load i32* %command, align 4
  %22 = icmp ne i32 %21, 0
  br i1 %22, label %23, label %24

; <label>:23                                      ; preds = %16
  br label %26

; <label>:24                                      ; preds = %16
  call void @__assert_fail(i8* getelementptr inbounds ([13 x i8]* @.str30, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 296, i8* getelementptr inbounds ([30 x i8]* @__PRETTY_FUNCTION__._Z4evalPjPb, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %26

; <label>:26                                      ; preds = %25, %23
  %27 = load i32* %command, align 4
  switch i32 %27, label %81 [
    i32 41617, label %28
    i32 49466, label %31
    i32 51284, label %58
  ]

; <label>:28                                      ; preds = %26
  %29 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([6 x i8]* @.str31, i32 0, i32 0))
  %30 = load i8** %2, align 4
  store i8 0, i8* %30, align 1
  br label %82

; <label>:31                                      ; preds = %26
  %32 = load i32** %1, align 4
  %33 = getelementptr inbounds i32* %32, i32 21
  %34 = load i32* %33, align 4
  %35 = load i32** %1, align 4
  %36 = getelementptr inbounds i32* %35, i32 26
  %37 = load i32* %36, align 4
  %38 = icmp eq i32 %34, %37
  br i1 %38, label %39, label %40

; <label>:39                                      ; preds = %31
  br label %42

; <label>:40                                      ; preds = %31
  call void @__assert_fail(i8* getelementptr inbounds ([37 x i8]* @.str32, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 303, i8* getelementptr inbounds ([30 x i8]* @__PRETTY_FUNCTION__._Z4evalPjPb, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %42

; <label>:42                                      ; preds = %41, %39
  %43 = load i32** %1, align 4
  %44 = getelementptr inbounds i32* %43, i32 5
  %45 = load i32* %44, align 4
  %46 = load i32** %1, align 4
  %47 = getelementptr inbounds i32* %46, i32 10
  %48 = load i32* %47, align 4
  %49 = add i32 %45, %48
  %50 = load i32** %1, align 4
  %51 = getelementptr inbounds i32* %50, i32 6
  %52 = load i32* %51, align 4
  %53 = add i32 %49, %52
  %54 = load i32** %1, align 4
  %55 = getelementptr inbounds i32* %54, i32 5
  store i32 %53, i32* %55, align 4
  %56 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([7 x i8]* @.str33, i32 0, i32 0))
  %57 = load i32** %1, align 4
  call void @_Z9printRegsPKj(i32* %57)
  br label %82

; <label>:58                                      ; preds = %26
  %59 = load i32** %1, align 4
  %60 = getelementptr inbounds i32* %59, i32 22
  %61 = load i32* %60, align 4
  %62 = load i32** %1, align 4
  %63 = getelementptr inbounds i32* %62, i32 26
  %64 = load i32* %63, align 4
  %65 = icmp eq i32 %61, %64
  br i1 %65, label %66, label %67

; <label>:66                                      ; preds = %58
  br label %69

; <label>:67                                      ; preds = %58
  call void @__assert_fail(i8* getelementptr inbounds ([37 x i8]* @.str34, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 309, i8* getelementptr inbounds ([30 x i8]* @__PRETTY_FUNCTION__._Z4evalPjPb, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %69

; <label>:69                                      ; preds = %68, %66
  %70 = load i32** %1, align 4
  %71 = getelementptr inbounds i32* %70, i32 6
  %72 = load i32* %71, align 4
  %73 = load i32** %1, align 4
  %74 = getelementptr inbounds i32* %73, i32 10
  %75 = load i32* %74, align 4
  %76 = sub i32 %72, %75
  %77 = load i32** %1, align 4
  %78 = getelementptr inbounds i32* %77, i32 5
  store i32 %76, i32* %78, align 4
  %79 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([12 x i8]* @.str35, i32 0, i32 0))
  %80 = load i32** %1, align 4
  call void @_Z9printRegsPKj(i32* %80)
  br label %82

; <label>:81                                      ; preds = %26
  call void @error(i8* getelementptr inbounds ([22 x i8]* @.str36, i32 0, i32 0))
  br label %82

; <label>:82                                      ; preds = %81, %69, %42, %28
  br label %83

; <label>:83                                      ; preds = %82, %0
  ret void
}

define i32 @main() #0 {
  %1 = alloca i32, align 4
  %prog = alloca [10 x i32], align 4
  %progLength = alloca i32, align 4
  %memory = alloca [48 x i32], align 4
  %returnCode = alloca i32, align 4
  %sourceCode = alloca %struct._IO_FILE*, align 4
  %tokenFile = alloca %struct._IO_FILE*, align 4
  %sourceSentenceLength = alloca i32, align 4
  %tokenSentenceLength = alloca i32, align 4
  %outputSentenceLength = alloca i32, align 4
  %sourceSentence = alloca [60 x i8], align 1
  %tokenSentence = alloca [30 x i16], align 2
  %outputSentence = alloca [60 x i8], align 1
  store i32 0, i32* %1
  %2 = bitcast [10 x i32]* %prog to i8*
  call void @llvm.memcpy.p0i8.p0i8.i32(i8* %2, i8* bitcast ([10 x i32]* @_ZZ4mainE4prog to i8*), i32 40, i32 4, i1 false)
  store i32 10, i32* %progLength, align 4
  store i32 0, i32* %returnCode, align 4
  store i32 60, i32* %sourceSentenceLength, align 4
  store i32 30, i32* %tokenSentenceLength, align 4
  store i32 60, i32* %outputSentenceLength, align 4
  %3 = bitcast [60 x i8]* %sourceSentence to i8*
  call void @llvm.memset.p0i8.i32(i8* %3, i8 0, i32 60, i32 1, i1 false)
  %4 = bitcast [30 x i16]* %tokenSentence to i8*
  call void @llvm.memset.p0i8.i32(i8* %4, i8 0, i32 60, i32 2, i1 false)
  %5 = bitcast [60 x i8]* %outputSentence to i8*
  call void @llvm.memset.p0i8.i32(i8* %5, i8 0, i32 60, i32 1, i1 false)
  %6 = call %struct._IO_FILE* @fopen(i8* getelementptr inbounds ([8 x i8]* @.str4, i32 0, i32 0), i8* getelementptr inbounds ([2 x i8]* @.str5, i32 0, i32 0))
  store %struct._IO_FILE* %6, %struct._IO_FILE** %sourceCode, align 4
  %7 = call %struct._IO_FILE* @fopen(i8* getelementptr inbounds ([8 x i8]* @.str6, i32 0, i32 0), i8* getelementptr inbounds ([2 x i8]* @.str7, i32 0, i32 0))
  store %struct._IO_FILE* %7, %struct._IO_FILE** %tokenFile, align 4
  %8 = load %struct._IO_FILE** %sourceCode, align 4
  %9 = icmp ne %struct._IO_FILE* %8, null
  br i1 %9, label %10, label %11

; <label>:10                                      ; preds = %0
  br label %13

; <label>:11                                      ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([21 x i8]* @.str8, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 496, i8* getelementptr inbounds ([11 x i8]* @__PRETTY_FUNCTION__.main, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %13

; <label>:13                                      ; preds = %12, %10
  %14 = load %struct._IO_FILE** %tokenFile, align 4
  %15 = icmp ne %struct._IO_FILE* %14, null
  br i1 %15, label %16, label %17

; <label>:16                                      ; preds = %13
  br label %19

; <label>:17                                      ; preds = %13
  call void @__assert_fail(i8* getelementptr inbounds ([20 x i8]* @.str9, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 497, i8* getelementptr inbounds ([11 x i8]* @__PRETTY_FUNCTION__.main, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %19

; <label>:19                                      ; preds = %18, %16
  %20 = getelementptr inbounds [60 x i8]* %sourceSentence, i32 0, i32 0
  %21 = load %struct._IO_FILE** %sourceCode, align 4
  %22 = call i32 @fread(i8* %20, i32 1, i32 60, %struct._IO_FILE* %21)
  store i32 %22, i32* %sourceSentenceLength, align 4
  %23 = load i32* %sourceSentenceLength, align 4
  %24 = icmp ugt i32 %23, 0
  br i1 %24, label %25, label %26

; <label>:25                                      ; preds = %19
  br label %28

; <label>:26                                      ; preds = %19
  call void @__assert_fail(i8* getelementptr inbounds ([25 x i8]* @.str10, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 500, i8* getelementptr inbounds ([11 x i8]* @__PRETTY_FUNCTION__.main, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %28

; <label>:28                                      ; preds = %27, %25
  %29 = load i32* %sourceSentenceLength, align 4
  %30 = getelementptr inbounds [60 x i8]* %sourceSentence, i32 0, i32 0
  %31 = getelementptr inbounds [30 x i16]* %tokenSentence, i32 0, i32 0
  call void @_Z8tokenizejPcPjPt(i32 %29, i8* %30, i32* %tokenSentenceLength, i16* %31)
  %32 = load i32* %tokenSentenceLength, align 4
  %33 = getelementptr inbounds [30 x i16]* %tokenSentence, i32 0, i32 0
  %34 = getelementptr inbounds [60 x i8]* %outputSentence, i32 0, i32 0
  call void @uint16ArrayToCharArray(i32 %32, i16* %33, i32* %outputSentenceLength, i8* %34)
  %35 = getelementptr inbounds [60 x i8]* %outputSentence, i32 0, i32 0
  %36 = load i32* %outputSentenceLength, align 4
  %37 = load %struct._IO_FILE** %tokenFile, align 4
  %38 = call i32 @fwrite(i8* %35, i32 1, i32 %36, %struct._IO_FILE* %37)
  store i32 %38, i32* %returnCode, align 4
  %39 = load i32* %returnCode, align 4
  %40 = load i32* %outputSentenceLength, align 4
  %41 = icmp eq i32 %39, %40
  br i1 %41, label %42, label %43

; <label>:42                                      ; preds = %28
  br label %45

; <label>:43                                      ; preds = %28
  call void @__assert_fail(i8* getelementptr inbounds ([44 x i8]* @.str11, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 507, i8* getelementptr inbounds ([11 x i8]* @__PRETTY_FUNCTION__.main, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %45

; <label>:45                                      ; preds = %44, %42
  %46 = load %struct._IO_FILE** %sourceCode, align 4
  %47 = call i32 @fclose(%struct._IO_FILE* %46)
  store i32 %47, i32* %returnCode, align 4
  %48 = load i32* %returnCode, align 4
  %49 = icmp eq i32 %48, 0
  br i1 %49, label %50, label %51

; <label>:50                                      ; preds = %45
  br label %53

; <label>:51                                      ; preds = %45
  call void @__assert_fail(i8* getelementptr inbounds ([16 x i8]* @.str12, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 509, i8* getelementptr inbounds ([11 x i8]* @__PRETTY_FUNCTION__.main, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %53

; <label>:53                                      ; preds = %52, %50
  %54 = load %struct._IO_FILE** %tokenFile, align 4
  %55 = call i32 @fclose(%struct._IO_FILE* %54)
  store i32 %55, i32* %returnCode, align 4
  %56 = load i32* %returnCode, align 4
  %57 = icmp eq i32 %56, 0
  br i1 %57, label %58, label %59

; <label>:58                                      ; preds = %53
  br label %61

; <label>:59                                      ; preds = %53
  call void @__assert_fail(i8* getelementptr inbounds ([16 x i8]* @.str12, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 511, i8* getelementptr inbounds ([11 x i8]* @__PRETTY_FUNCTION__.main, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %61

; <label>:61                                      ; preds = %60, %58
  %62 = bitcast [48 x i32]* %memory to i8*
  call void @llvm.memset.p0i8.i32(i8* %62, i8 0, i32 192, i32 4, i1 false)
  %63 = load i32* %progLength, align 4
  %64 = icmp ugt i32 %63, 0
  br i1 %64, label %65, label %66

; <label>:65                                      ; preds = %61
  br label %68

; <label>:66                                      ; preds = %61
  call void @__assert_fail(i8* getelementptr inbounds ([15 x i8]* @.str13, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 514, i8* getelementptr inbounds ([11 x i8]* @__PRETTY_FUNCTION__.main, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %68

; <label>:68                                      ; preds = %67, %65
  %69 = load i32* %progLength, align 4
  %70 = getelementptr inbounds [10 x i32]* %prog, i32 0, i32 0
  %71 = getelementptr inbounds [48 x i32]* %memory, i32 0, i32 0
  call void @run(i32 %69, i32* %70, i32* %71)
  ret i32 0
}

; Function Attrs: nounwind
declare void @llvm.memcpy.p0i8.p0i8.i32(i8* nocapture, i8* nocapture readonly, i32, i32, i1) #1

declare %struct._IO_FILE* @fopen(i8*, i8*) #0

declare i32 @fread(i8*, i32, i32, %struct._IO_FILE*) #0

define internal void @_Z8tokenizejPcPjPt(i32 %sourceSentenceLength, i8* %sourceSentence, i32* %tokenSentenceLength, i16* %tokenSentence) #0 {
  %1 = alloca i32, align 4
  %2 = alloca i8*, align 4
  %3 = alloca i32*, align 4
  %4 = alloca i16*, align 4
  %sourceIndex = alloca i32, align 4
  %tokenIndex = alloca i32, align 4
  %tempSourceIndex = alloca i32, align 4
  %glyphs = alloca [6 x i8], align 1
  %nibbles = alloca [5 x i8], align 1
  store i32 %sourceSentenceLength, i32* %1, align 4
  store i8* %sourceSentence, i8** %2, align 4
  store i32* %tokenSentenceLength, i32** %3, align 4
  store i16* %tokenSentence, i16** %4, align 4
  store i32 0, i32* %sourceIndex, align 4
  store i32 0, i32* %tokenIndex, align 4
  store i32 0, i32* %tempSourceIndex, align 4
  %5 = bitcast [6 x i8]* %glyphs to i8*
  call void @llvm.memcpy.p0i8.p0i8.i32(i8* %5, i8* getelementptr inbounds ([6 x i8]* @_ZZ8tokenizejPcPjPtE6glyphs, i32 0, i32 0), i32 6, i32 1, i1 false)
  %6 = bitcast [5 x i8]* %nibbles to i8*
  call void @llvm.memset.p0i8.i32(i8* %6, i8 0, i32 5, i32 1, i1 false)
  %7 = load i32* %1, align 4
  %8 = icmp ugt i32 %7, 0
  br i1 %8, label %9, label %10

; <label>:9                                       ; preds = %0
  br label %12

; <label>:10                                      ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([25 x i8]* @.str10, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 386, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z8tokenizejPcPjPt, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %12

; <label>:12                                      ; preds = %11, %9
  %13 = load i8** %2, align 4
  %14 = icmp ne i8* %13, null
  br i1 %14, label %15, label %16

; <label>:15                                      ; preds = %12
  br label %18

; <label>:16                                      ; preds = %12
  call void @__assert_fail(i8* getelementptr inbounds ([25 x i8]* @.str14, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 387, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z8tokenizejPcPjPt, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %18

; <label>:18                                      ; preds = %17, %15
  %19 = load i32** %3, align 4
  %20 = icmp ne i32* %19, null
  br i1 %20, label %21, label %22

; <label>:21                                      ; preds = %18
  br label %24

; <label>:22                                      ; preds = %18
  call void @__assert_fail(i8* getelementptr inbounds ([30 x i8]* @.str15, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 388, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z8tokenizejPcPjPt, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %24

; <label>:24                                      ; preds = %23, %21
  %25 = load i16** %4, align 4
  %26 = icmp ne i16* %25, null
  br i1 %26, label %27, label %28

; <label>:27                                      ; preds = %24
  br label %30

; <label>:28                                      ; preds = %24
  call void @__assert_fail(i8* getelementptr inbounds ([24 x i8]* @.str16, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 389, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z8tokenizejPcPjPt, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %30

; <label>:30                                      ; preds = %29, %27
  store i32 0, i32* %sourceIndex, align 4
  br label %31

; <label>:31                                      ; preds = %260, %30
  %32 = load i32* %sourceIndex, align 4
  %33 = load i32* %1, align 4
  %34 = icmp ult i32 %32, %33
  br i1 %34, label %35, label %263

; <label>:35                                      ; preds = %31
  %36 = load i32* %sourceIndex, align 4
  store i32 %36, i32* %tempSourceIndex, align 4
  %37 = load i32* %tempSourceIndex, align 4
  %38 = add i32 %37, 0
  %39 = load i8** %2, align 4
  %40 = getelementptr inbounds i8* %39, i32 %38
  %41 = load i8* %40, align 1
  %42 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 0
  store i8 %41, i8* %42, align 1
  %43 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 0
  %44 = load i8* %43, align 1
  %45 = call zeroext i1 @_Z7isSpacec(i8 zeroext %44)
  br i1 %45, label %46, label %47

; <label>:46                                      ; preds = %35
  br label %260

; <label>:47                                      ; preds = %35
  %48 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 0
  %49 = load i8* %48, align 1
  %50 = call zeroext i8 @lankGlyphToNibble(i8 zeroext %49)
  %51 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 0
  store i8 %50, i8* %51, align 1
  %52 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 0
  %53 = load i8* %52, align 1
  %54 = zext i8 %53 to i32
  %55 = icmp sgt i32 %54, 12
  br i1 %55, label %56, label %78

; <label>:56                                      ; preds = %47
  %57 = load i32* %tempSourceIndex, align 4
  %58 = load i8** %2, align 4
  %59 = getelementptr inbounds i8* %58, i32 %57
  store i8 88, i8* %59, align 1
  %60 = load i32* %tokenIndex, align 4
  %61 = sub i32 %60, 1
  %62 = load i16** %4, align 4
  %63 = getelementptr inbounds i16* %62, i32 %61
  %64 = load i16* %63, align 2
  %65 = zext i16 %64 to i32
  %66 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str17, i32 0, i32 0), i32 %65)
  %67 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 0
  %68 = load i8* %67, align 1
  %69 = zext i8 %68 to i32
  %70 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([15 x i8]* @.str18, i32 0, i32 0), i32 %69)
  %71 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 0
  %72 = load i8* %71, align 1
  %73 = zext i8 %72 to i32
  %74 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([11 x i8]* @.str19, i32 0, i32 0), i32 %73)
  %75 = load i32* %tempSourceIndex, align 4
  %76 = load i8** %2, align 4
  %77 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([14 x i8]* @.str20, i32 0, i32 0), i32 %75, i8* %76)
  call void @error(i8* getelementptr inbounds ([38 x i8]* @.str21, i32 0, i32 0))
  br label %78

; <label>:78                                      ; preds = %56, %47
  %79 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 0
  %80 = load i8* %79, align 1
  %81 = zext i8 %80 to i32
  %82 = icmp sle i32 %81, 12
  br i1 %82, label %83, label %84

; <label>:83                                      ; preds = %78
  br label %86

; <label>:84                                      ; preds = %78
  call void @__assert_fail(i8* getelementptr inbounds ([18 x i8]* @.str22, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 408, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z8tokenizejPcPjPt, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %86

; <label>:86                                      ; preds = %85, %83
  %87 = load i32* %tempSourceIndex, align 4
  %88 = add i32 %87, 3
  %89 = load i32* %1, align 4
  %90 = icmp ult i32 %88, %89
  br i1 %90, label %91, label %92

; <label>:91                                      ; preds = %86
  br label %94

; <label>:92                                      ; preds = %86
  call void @__assert_fail(i8* getelementptr inbounds ([41 x i8]* @.str23, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 409, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z8tokenizejPcPjPt, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %94

; <label>:94                                      ; preds = %93, %91
  %95 = load i32* %tempSourceIndex, align 4
  %96 = add i32 %95, 1
  %97 = load i8** %2, align 4
  %98 = getelementptr inbounds i8* %97, i32 %96
  %99 = load i8* %98, align 1
  %100 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 1
  store i8 %99, i8* %100, align 1
  %101 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 1
  %102 = load i8* %101, align 1
  %103 = call zeroext i1 @_Z7isSpacec(i8 zeroext %102)
  br i1 %103, label %104, label %116

; <label>:104                                     ; preds = %94
  %105 = load i32* %tempSourceIndex, align 4
  %106 = add i32 %105, 1
  %107 = load i8** %2, align 4
  %108 = getelementptr inbounds i8* %107, i32 %106
  store i8 88, i8* %108, align 1
  %109 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 1
  %110 = load i8* %109, align 1
  %111 = zext i8 %110 to i32
  %112 = load i32* %tempSourceIndex, align 4
  %113 = add nsw i32 %112, 1
  %114 = load i8** %2, align 4
  %115 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str24, i32 0, i32 0), i32 %111, i32 %113, i8* %114)
  call void @error(i8* getelementptr inbounds ([26 x i8]* @.str25, i32 0, i32 0))
  br label %116

; <label>:116                                     ; preds = %104, %94
  %117 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 1
  %118 = load i8* %117, align 1
  %119 = call zeroext i1 @_Z7isSpacec(i8 zeroext %118)
  br i1 %119, label %121, label %120

; <label>:120                                     ; preds = %116
  br label %123

; <label>:121                                     ; preds = %116
  call void @__assert_fail(i8* getelementptr inbounds ([20 x i8]* @.str26, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 417, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z8tokenizejPcPjPt, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %123

; <label>:123                                     ; preds = %122, %120
  %124 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 1
  %125 = load i8* %124, align 1
  %126 = call zeroext i8 @lankGlyphToNibble(i8 zeroext %125)
  %127 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 1
  store i8 %126, i8* %127, align 1
  %128 = load i32* %tempSourceIndex, align 4
  %129 = add i32 %128, 2
  %130 = load i8** %2, align 4
  %131 = getelementptr inbounds i8* %130, i32 %129
  %132 = load i8* %131, align 1
  %133 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 2
  store i8 %132, i8* %133, align 1
  %134 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 2
  %135 = load i8* %134, align 1
  %136 = call zeroext i1 @_Z7isSpacec(i8 zeroext %135)
  br i1 %136, label %137, label %152

; <label>:137                                     ; preds = %123
  %138 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 0
  %139 = call zeroext i16 @_Z17shortWordTokenizePh(i8* %138)
  %140 = zext i16 %139 to i32
  %141 = load i32* %tokenIndex, align 4
  %142 = load i16** %4, align 4
  %143 = getelementptr inbounds i16* %142, i32 %141
  %144 = load i16* %143, align 2
  %145 = zext i16 %144 to i32
  %146 = add nsw i32 %145, %140
  %147 = trunc i32 %146 to i16
  store i16 %147, i16* %143, align 2
  %148 = load i32* %tokenIndex, align 4
  %149 = add i32 %148, 1
  store i32 %149, i32* %tokenIndex, align 4
  %150 = load i32* %sourceIndex, align 4
  %151 = add i32 %150, 1
  store i32 %151, i32* %sourceIndex, align 4
  br label %260

; <label>:152                                     ; preds = %123
  %153 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 2
  %154 = load i8* %153, align 1
  %155 = call zeroext i8 @lankGlyphToNibble(i8 zeroext %154)
  %156 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 2
  store i8 %155, i8* %156, align 1
  %157 = load i32* %tempSourceIndex, align 4
  %158 = add i32 %157, 3
  %159 = load i8** %2, align 4
  %160 = getelementptr inbounds i8* %159, i32 %158
  %161 = load i8* %160, align 1
  %162 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 3
  store i8 %161, i8* %162, align 1
  %163 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 3
  %164 = load i8* %163, align 1
  %165 = call zeroext i1 @_Z7isSpacec(i8 zeroext %164)
  br i1 %165, label %166, label %178

; <label>:166                                     ; preds = %152
  %167 = load i32* %tempSourceIndex, align 4
  %168 = add i32 %167, 3
  %169 = load i8** %2, align 4
  %170 = getelementptr inbounds i8* %169, i32 %168
  store i8 88, i8* %170, align 1
  %171 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 3
  %172 = load i8* %171, align 1
  %173 = zext i8 %172 to i32
  %174 = load i32* %tempSourceIndex, align 4
  %175 = add nsw i32 %174, 3
  %176 = load i8** %2, align 4
  %177 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str24, i32 0, i32 0), i32 %173, i32 %175, i8* %176)
  call void @error(i8* getelementptr inbounds ([26 x i8]* @.str25, i32 0, i32 0))
  br label %178

; <label>:178                                     ; preds = %166, %152
  %179 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 3
  %180 = load i8* %179, align 1
  %181 = call zeroext i1 @_Z7isSpacec(i8 zeroext %180)
  br i1 %181, label %183, label %182

; <label>:182                                     ; preds = %178
  br label %185

; <label>:183                                     ; preds = %178
  call void @__assert_fail(i8* getelementptr inbounds ([20 x i8]* @.str27, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 435, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z8tokenizejPcPjPt, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %185

; <label>:185                                     ; preds = %184, %182
  %186 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 3
  %187 = load i8* %186, align 1
  %188 = call zeroext i8 @lankGlyphToNibble(i8 zeroext %187)
  %189 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 3
  store i8 %188, i8* %189, align 1
  %190 = load i32* %tempSourceIndex, align 4
  %191 = add i32 %190, 4
  %192 = load i32* %1, align 4
  %193 = icmp ult i32 %191, %192
  br i1 %193, label %194, label %212

; <label>:194                                     ; preds = %185
  %195 = load i32* %tempSourceIndex, align 4
  %196 = add i32 %195, 4
  %197 = load i8** %2, align 4
  %198 = getelementptr inbounds i8* %197, i32 %196
  %199 = load i8* %198, align 1
  %200 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 4
  store i8 %199, i8* %200, align 1
  %201 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 4
  %202 = load i8* %201, align 1
  %203 = call zeroext i1 @_Z7isSpacec(i8 zeroext %202)
  br i1 %203, label %204, label %206

; <label>:204                                     ; preds = %194
  %205 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 4
  store i8 12, i8* %205, align 1
  br label %211

; <label>:206                                     ; preds = %194
  %207 = getelementptr inbounds [6 x i8]* %glyphs, i32 0, i32 4
  %208 = load i8* %207, align 1
  %209 = call zeroext i8 @lankGlyphToNibble(i8 zeroext %208)
  %210 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 4
  store i8 %209, i8* %210, align 1
  br label %211

; <label>:211                                     ; preds = %206, %204
  br label %214

; <label>:212                                     ; preds = %185
  %213 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 4
  store i8 12, i8* %213, align 1
  br label %214

; <label>:214                                     ; preds = %212, %211
  %215 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 4
  %216 = load i8* %215, align 1
  %217 = zext i8 %216 to i32
  %218 = icmp sle i32 %217, 12
  br i1 %218, label %219, label %244

; <label>:219                                     ; preds = %214
  %220 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 1
  %221 = load i8* %220, align 1
  %222 = zext i8 %221 to i32
  %223 = icmp slt i32 %222, 12
  br i1 %223, label %234, label %224

; <label>:224                                     ; preds = %219
  %225 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 3
  %226 = load i8* %225, align 1
  %227 = zext i8 %226 to i32
  %228 = icmp slt i32 %227, 12
  br i1 %228, label %229, label %244

; <label>:229                                     ; preds = %224
  %230 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 2
  %231 = load i8* %230, align 1
  %232 = zext i8 %231 to i32
  %233 = icmp ne i32 %232, 12
  br i1 %233, label %234, label %244

; <label>:234                                     ; preds = %229, %219
  %235 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 0
  %236 = call zeroext i16 @_Z16fullWordTokenizePKh(i8* %235)
  %237 = load i32* %tokenIndex, align 4
  %238 = load i16** %4, align 4
  %239 = getelementptr inbounds i16* %238, i32 %237
  store i16 %236, i16* %239, align 2
  %240 = load i32* %tokenIndex, align 4
  %241 = add i32 %240, 1
  store i32 %241, i32* %tokenIndex, align 4
  %242 = load i32* %sourceIndex, align 4
  %243 = add i32 %242, 3
  store i32 %243, i32* %sourceIndex, align 4
  br label %259

; <label>:244                                     ; preds = %229, %224, %214
  %245 = getelementptr inbounds [5 x i8]* %nibbles, i32 0, i32 0
  %246 = call zeroext i16 @_Z17shortWordTokenizePh(i8* %245)
  %247 = zext i16 %246 to i32
  %248 = load i32* %tokenIndex, align 4
  %249 = load i16** %4, align 4
  %250 = getelementptr inbounds i16* %249, i32 %248
  %251 = load i16* %250, align 2
  %252 = zext i16 %251 to i32
  %253 = add nsw i32 %252, %247
  %254 = trunc i32 %253 to i16
  store i16 %254, i16* %250, align 2
  %255 = load i32* %tokenIndex, align 4
  %256 = add i32 %255, 1
  store i32 %256, i32* %tokenIndex, align 4
  %257 = load i32* %sourceIndex, align 4
  %258 = add i32 %257, 1
  store i32 %258, i32* %sourceIndex, align 4
  br label %259

; <label>:259                                     ; preds = %244, %234
  br label %260

; <label>:260                                     ; preds = %259, %137, %46
  %261 = load i32* %sourceIndex, align 4
  %262 = add i32 %261, 1
  store i32 %262, i32* %sourceIndex, align 4
  br label %31

; <label>:263                                     ; preds = %31
  %264 = load i32* %tokenIndex, align 4
  %265 = icmp ule i32 %264, 30
  br i1 %265, label %266, label %267

; <label>:266                                     ; preds = %263
  br label %269

; <label>:267                                     ; preds = %263
  call void @__assert_fail(i8* getelementptr inbounds ([19 x i8]* @.str28, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 461, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z8tokenizejPcPjPt, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %269

; <label>:269                                     ; preds = %268, %266
  %270 = load i32* %tokenIndex, align 4
  %271 = load i32** %3, align 4
  store i32 %270, i32* %271, align 4
  ret void
}

declare void @uint16ArrayToCharArray(i32, i16*, i32*, i8*) #0

declare i32 @fwrite(i8*, i32, i32, %struct._IO_FILE*) #0

declare i32 @fclose(%struct._IO_FILE*) #0

; Function Attrs: nounwind
define internal zeroext i1 @_Z7isSpacec(i8 zeroext %glyph) #3 {
  %1 = alloca i1, align 1
  %2 = alloca i8, align 1
  store i8 %glyph, i8* %2, align 1
  %3 = load i8* %2, align 1
  %4 = zext i8 %3 to i32
  %5 = icmp sle i32 %4, 32
  br i1 %5, label %6, label %7

; <label>:6                                       ; preds = %0
  store i1 true, i1* %1
  br label %8

; <label>:7                                       ; preds = %0
  store i1 false, i1* %1
  br label %8

; <label>:8                                       ; preds = %7, %6
  %9 = load i1* %1
  ret i1 %9
}

declare zeroext i8 @lankGlyphToNibble(i8 zeroext) #0

declare void @error(i8*) #0

; Function Attrs: nounwind
define internal zeroext i16 @_Z17shortWordTokenizePh(i8* %nibbles) #3 {
  %1 = alloca i8*, align 4
  %j = alloca i8, align 1
  %token = alloca i16, align 2
  store i8* %nibbles, i8** %1, align 4
  store i8 0, i8* %j, align 1
  store i16 0, i16* %token, align 2
  store i8 2, i8* %j, align 1
  br label %2

; <label>:2                                       ; preds = %11, %0
  %3 = load i8* %j, align 1
  %4 = zext i8 %3 to i32
  %5 = icmp slt i32 %4, 4
  br i1 %5, label %6, label %14

; <label>:6                                       ; preds = %2
  %7 = load i8* %j, align 1
  %8 = zext i8 %7 to i32
  %9 = load i8** %1, align 4
  %10 = getelementptr inbounds i8* %9, i32 %8
  store i8 12, i8* %10, align 1
  br label %11

; <label>:11                                      ; preds = %6
  %12 = load i8* %j, align 1
  %13 = add i8 %12, 1
  store i8 %13, i8* %j, align 1
  br label %2

; <label>:14                                      ; preds = %2
  store i8 0, i8* %j, align 1
  br label %15

; <label>:15                                      ; preds = %36, %14
  %16 = load i8* %j, align 1
  %17 = zext i8 %16 to i32
  %18 = icmp slt i32 %17, 4
  br i1 %18, label %19, label %39

; <label>:19                                      ; preds = %15
  %20 = load i8* %j, align 1
  %21 = zext i8 %20 to i32
  %22 = load i8** %1, align 4
  %23 = getelementptr inbounds i8* %22, i32 %21
  %24 = load i8* %23, align 1
  %25 = zext i8 %24 to i32
  %26 = load i8* %j, align 1
  %27 = zext i8 %26 to i32
  %28 = mul nsw i32 4, %27
  %29 = shl i32 %25, %28
  %30 = trunc i32 %29 to i16
  %31 = zext i16 %30 to i32
  %32 = load i16* %token, align 2
  %33 = zext i16 %32 to i32
  %34 = add nsw i32 %33, %31
  %35 = trunc i32 %34 to i16
  store i16 %35, i16* %token, align 2
  br label %36

; <label>:36                                      ; preds = %19
  %37 = load i8* %j, align 1
  %38 = add i8 %37, 1
  store i8 %38, i8* %j, align 1
  br label %15

; <label>:39                                      ; preds = %15
  %40 = load i16* %token, align 2
  ret i16 %40
}

; Function Attrs: nounwind
define internal zeroext i16 @_Z16fullWordTokenizePKh(i8* %nibbles) #3 {
  %1 = alloca i8*, align 4
  %j = alloca i8, align 1
  %token = alloca i16, align 2
  store i8* %nibbles, i8** %1, align 4
  store i8 0, i8* %j, align 1
  store i16 0, i16* %token, align 2
  store i8 0, i8* %j, align 1
  br label %2

; <label>:2                                       ; preds = %23, %0
  %3 = load i8* %j, align 1
  %4 = zext i8 %3 to i32
  %5 = icmp slt i32 %4, 4
  br i1 %5, label %6, label %26

; <label>:6                                       ; preds = %2
  %7 = load i8* %j, align 1
  %8 = zext i8 %7 to i32
  %9 = load i8** %1, align 4
  %10 = getelementptr inbounds i8* %9, i32 %8
  %11 = load i8* %10, align 1
  %12 = zext i8 %11 to i32
  %13 = load i8* %j, align 1
  %14 = zext i8 %13 to i32
  %15 = mul nsw i32 4, %14
  %16 = shl i32 %12, %15
  %17 = trunc i32 %16 to i16
  %18 = zext i16 %17 to i32
  %19 = load i16* %token, align 2
  %20 = zext i16 %19 to i32
  %21 = add nsw i32 %20, %18
  %22 = trunc i32 %21 to i16
  store i16 %22, i16* %token, align 2
  br label %23

; <label>:23                                      ; preds = %6
  %24 = load i8* %j, align 1
  %25 = add i8 %24, 1
  store i8 %25, i8* %j, align 1
  br label %2

; <label>:26                                      ; preds = %2
  %27 = load i16* %token, align 2
  ret i16 %27
}

define internal void @_Z9printRegsPKj(i32* %memory) #0 {
  %1 = alloca i32*, align 4
  %printedLength = alloca i32, align 4
  store i32* %memory, i32** %1, align 4
  store i32 0, i32* %printedLength, align 4
  %2 = load i32** %1, align 4
  %3 = icmp ne i32* %2, null
  br i1 %3, label %4, label %5

; <label>:4                                       ; preds = %0
  br label %7

; <label>:5                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str37, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 191, i8* getelementptr inbounds ([33 x i8]* @__PRETTY_FUNCTION__._Z9printRegsPKj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %7

; <label>:7                                       ; preds = %6, %4
  %8 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([13 x i8]* @.str38, i32 0, i32 0))
  %9 = load i32* %printedLength, align 4
  %10 = add i32 %9, %8
  store i32 %10, i32* %printedLength, align 4
  %11 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([19 x i8]* @.str39, i32 0, i32 0))
  %12 = load i32* %printedLength, align 4
  %13 = add i32 %12, %11
  store i32 %13, i32* %printedLength, align 4
  %14 = load i32** %1, align 4
  %15 = getelementptr inbounds i32* %14, i32 0
  %16 = load i32* %15, align 4
  %17 = load i32** %1, align 4
  %18 = getelementptr inbounds i32* %17, i32 16
  %19 = load i32* %18, align 4
  %20 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str40, i32 0, i32 0), i32 %16, i32 %19)
  %21 = load i32* %printedLength, align 4
  %22 = add i32 %21, %20
  store i32 %22, i32* %printedLength, align 4
  %23 = load i32** %1, align 4
  %24 = getelementptr inbounds i32* %23, i32 1
  %25 = load i32* %24, align 4
  %26 = load i32** %1, align 4
  %27 = getelementptr inbounds i32* %26, i32 17
  %28 = load i32* %27, align 4
  %29 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str41, i32 0, i32 0), i32 %25, i32 %28)
  %30 = load i32* %printedLength, align 4
  %31 = add i32 %30, %29
  store i32 %31, i32* %printedLength, align 4
  %32 = load i32** %1, align 4
  %33 = getelementptr inbounds i32* %32, i32 2
  %34 = load i32* %33, align 4
  %35 = load i32** %1, align 4
  %36 = getelementptr inbounds i32* %35, i32 18
  %37 = load i32* %36, align 4
  %38 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str42, i32 0, i32 0), i32 %34, i32 %37)
  %39 = load i32* %printedLength, align 4
  %40 = add i32 %39, %38
  store i32 %40, i32* %printedLength, align 4
  %41 = load i32** %1, align 4
  %42 = getelementptr inbounds i32* %41, i32 3
  %43 = load i32* %42, align 4
  %44 = load i32** %1, align 4
  %45 = getelementptr inbounds i32* %44, i32 19
  %46 = load i32* %45, align 4
  %47 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str43, i32 0, i32 0), i32 %43, i32 %46)
  %48 = load i32* %printedLength, align 4
  %49 = add i32 %48, %47
  store i32 %49, i32* %printedLength, align 4
  %50 = load i32** %1, align 4
  %51 = getelementptr inbounds i32* %50, i32 4
  %52 = load i32* %51, align 4
  %53 = load i32** %1, align 4
  %54 = getelementptr inbounds i32* %53, i32 20
  %55 = load i32* %54, align 4
  %56 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str44, i32 0, i32 0), i32 %52, i32 %55)
  %57 = load i32* %printedLength, align 4
  %58 = add i32 %57, %56
  store i32 %58, i32* %printedLength, align 4
  %59 = load i32** %1, align 4
  %60 = getelementptr inbounds i32* %59, i32 5
  %61 = load i32* %60, align 4
  %62 = load i32** %1, align 4
  %63 = getelementptr inbounds i32* %62, i32 21
  %64 = load i32* %63, align 4
  %65 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str45, i32 0, i32 0), i32 %61, i32 %64)
  %66 = load i32* %printedLength, align 4
  %67 = add i32 %66, %65
  store i32 %67, i32* %printedLength, align 4
  %68 = load i32** %1, align 4
  %69 = getelementptr inbounds i32* %68, i32 6
  %70 = load i32* %69, align 4
  %71 = load i32** %1, align 4
  %72 = getelementptr inbounds i32* %71, i32 22
  %73 = load i32* %72, align 4
  %74 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str46, i32 0, i32 0), i32 %70, i32 %73)
  %75 = load i32* %printedLength, align 4
  %76 = add i32 %75, %74
  store i32 %76, i32* %printedLength, align 4
  %77 = load i32** %1, align 4
  %78 = getelementptr inbounds i32* %77, i32 7
  %79 = load i32* %78, align 4
  %80 = load i32** %1, align 4
  %81 = getelementptr inbounds i32* %80, i32 23
  %82 = load i32* %81, align 4
  %83 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str47, i32 0, i32 0), i32 %79, i32 %82)
  %84 = load i32* %printedLength, align 4
  %85 = add i32 %84, %83
  store i32 %85, i32* %printedLength, align 4
  %86 = load i32** %1, align 4
  %87 = getelementptr inbounds i32* %86, i32 8
  %88 = load i32* %87, align 4
  %89 = load i32** %1, align 4
  %90 = getelementptr inbounds i32* %89, i32 24
  %91 = load i32* %90, align 4
  %92 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str45, i32 0, i32 0), i32 %88, i32 %91)
  %93 = load i32* %printedLength, align 4
  %94 = add i32 %93, %92
  store i32 %94, i32* %printedLength, align 4
  %95 = load i32** %1, align 4
  %96 = getelementptr inbounds i32* %95, i32 9
  %97 = load i32* %96, align 4
  %98 = load i32** %1, align 4
  %99 = getelementptr inbounds i32* %98, i32 25
  %100 = load i32* %99, align 4
  %101 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str48, i32 0, i32 0), i32 %97, i32 %100)
  %102 = load i32* %printedLength, align 4
  %103 = add i32 %102, %101
  store i32 %103, i32* %printedLength, align 4
  %104 = load i32** %1, align 4
  %105 = getelementptr inbounds i32* %104, i32 9
  %106 = load i32* %105, align 4
  %107 = load i32** %1, align 4
  %108 = getelementptr inbounds i32* %107, i32 25
  %109 = load i32* %108, align 4
  %110 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str49, i32 0, i32 0), i32 %106, i32 %109)
  %111 = load i32* %printedLength, align 4
  %112 = add i32 %111, %110
  store i32 %112, i32* %printedLength, align 4
  %113 = load i32** %1, align 4
  %114 = getelementptr inbounds i32* %113, i32 11
  %115 = load i32* %114, align 4
  %116 = load i32** %1, align 4
  %117 = getelementptr inbounds i32* %116, i32 27
  %118 = load i32* %117, align 4
  %119 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str48, i32 0, i32 0), i32 %115, i32 %118)
  %120 = load i32* %printedLength, align 4
  %121 = add i32 %120, %119
  store i32 %121, i32* %printedLength, align 4
  %122 = load i32** %1, align 4
  %123 = getelementptr inbounds i32* %122, i32 12
  %124 = load i32* %123, align 4
  %125 = load i32** %1, align 4
  %126 = getelementptr inbounds i32* %125, i32 28
  %127 = load i32* %126, align 4
  %128 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str50, i32 0, i32 0), i32 %124, i32 %127)
  %129 = load i32* %printedLength, align 4
  %130 = add i32 %129, %128
  store i32 %130, i32* %printedLength, align 4
  %131 = load i32** %1, align 4
  %132 = getelementptr inbounds i32* %131, i32 14
  %133 = load i32* %132, align 4
  %134 = load i32** %1, align 4
  %135 = getelementptr inbounds i32* %134, i32 30
  %136 = load i32* %135, align 4
  %137 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str51, i32 0, i32 0), i32 %133, i32 %136)
  %138 = load i32* %printedLength, align 4
  %139 = add i32 %138, %137
  store i32 %139, i32* %printedLength, align 4
  %140 = load i32** %1, align 4
  %141 = getelementptr inbounds i32* %140, i32 15
  %142 = load i32* %141, align 4
  %143 = load i32** %1, align 4
  %144 = getelementptr inbounds i32* %143, i32 31
  %145 = load i32* %144, align 4
  %146 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str52, i32 0, i32 0), i32 %142, i32 %145)
  %147 = load i32* %printedLength, align 4
  %148 = add i32 %147, %146
  store i32 %148, i32* %printedLength, align 4
  %149 = load i32* %printedLength, align 4
  %150 = icmp ugt i32 %149, 0
  br i1 %150, label %151, label %152

; <label>:151                                     ; preds = %7
  br label %154

; <label>:152                                     ; preds = %7
  call void @__assert_fail(i8* getelementptr inbounds ([18 x i8]* @.str53, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 224, i8* getelementptr inbounds ([33 x i8]* @__PRETTY_FUNCTION__._Z9printRegsPKj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %154

; <label>:154                                     ; preds = %153, %151
  ret void
}

declare void @uint32ArrayToLankGlyphs(i32, i32*, i32, i8*) #0

define internal void @_Z12phraseDecodejtPj(i32 %phraseWord, i16 zeroext %typeWord, i32* %memory) #0 {
  %1 = alloca i32, align 4
  %2 = alloca i16, align 2
  %3 = alloca i32*, align 4
  store i32 %phraseWord, i32* %1, align 4
  store i16 %typeWord, i16* %2, align 2
  store i32* %memory, i32** %3, align 4
  %4 = load i32* %1, align 4
  %5 = icmp ne i32 %4, 0
  br i1 %5, label %6, label %40

; <label>:6                                       ; preds = %0
  %7 = load i32* %1, align 4
  switch i32 %7, label %38 [
    i32 60, label %8
    i32 58, label %18
    i32 89, label %28
  ]

; <label>:8                                       ; preds = %6
  %9 = load i32** %3, align 4
  %10 = getelementptr inbounds i32* %9, i32 0
  %11 = load i32* %10, align 4
  %12 = load i32** %3, align 4
  %13 = getelementptr inbounds i32* %12, i32 10
  store i32 %11, i32* %13, align 4
  %14 = load i16* %2, align 2
  %15 = zext i16 %14 to i32
  %16 = load i32** %3, align 4
  %17 = getelementptr inbounds i32* %16, i32 26
  store i32 %15, i32* %17, align 4
  br label %39

; <label>:18                                      ; preds = %6
  %19 = load i32** %3, align 4
  %20 = getelementptr inbounds i32* %19, i32 0
  %21 = load i32* %20, align 4
  %22 = load i32** %3, align 4
  %23 = getelementptr inbounds i32* %22, i32 5
  store i32 %21, i32* %23, align 4
  %24 = load i16* %2, align 2
  %25 = zext i16 %24 to i32
  %26 = load i32** %3, align 4
  %27 = getelementptr inbounds i32* %26, i32 21
  store i32 %25, i32* %27, align 4
  br label %39

; <label>:28                                      ; preds = %6
  %29 = load i32** %3, align 4
  %30 = getelementptr inbounds i32* %29, i32 0
  %31 = load i32* %30, align 4
  %32 = load i32** %3, align 4
  %33 = getelementptr inbounds i32* %32, i32 6
  store i32 %31, i32* %33, align 4
  %34 = load i16* %2, align 2
  %35 = zext i16 %34 to i32
  %36 = load i32** %3, align 4
  %37 = getelementptr inbounds i32* %36, i32 22
  store i32 %35, i32* %37, align 4
  br label %39

; <label>:38                                      ; preds = %6
  call void @error(i8* getelementptr inbounds ([33 x i8]* @.str62, i32 0, i32 0))
  br label %39

; <label>:39                                      ; preds = %38, %28, %18, %8
  br label %40

; <label>:40                                      ; preds = %39, %0
  ret void
}

; Function Attrs: nounwind
define internal i32 @_Z16amountOfSameBitsjj(i32 %number, i32 %maxLength) #3 {
  %1 = alloca i32, align 4
  %2 = alloca i32, align 4
  %length = alloca i32, align 4
  %i = alloca i32, align 4
  %firstBit = alloca i32, align 4
  %workNum = alloca i32, align 4
  store i32 %number, i32* %1, align 4
  store i32 %maxLength, i32* %2, align 4
  store i32 0, i32* %length, align 4
  %3 = load i32* %1, align 4
  store i32 %3, i32* %workNum, align 4
  %4 = load i32* %1, align 4
  %5 = icmp ult i32 %4, -1
  br i1 %5, label %6, label %7

; <label>:6                                       ; preds = %0
  br label %9

; <label>:7                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([32 x i8]* @.str71, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 83, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z16amountOfSameBitsjj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %9

; <label>:9                                       ; preds = %8, %6
  %10 = load i32* %2, align 4
  %11 = icmp ule i32 %10, 32
  br i1 %11, label %12, label %13

; <label>:12                                      ; preds = %9
  br label %15

; <label>:13                                      ; preds = %9
  call void @__assert_fail(i8* getelementptr inbounds ([36 x i8]* @.str72, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 84, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z16amountOfSameBitsjj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %15

; <label>:15                                      ; preds = %14, %12
  %16 = load i32* %workNum, align 4
  %17 = and i32 %16, 1
  store i32 %17, i32* %firstBit, align 4
  %18 = load i32* %firstBit, align 4
  %19 = icmp ule i32 %18, 1
  br i1 %19, label %20, label %21

; <label>:20                                      ; preds = %15
  br label %23

; <label>:21                                      ; preds = %15
  call void @__assert_fail(i8* getelementptr inbounds ([25 x i8]* @.str73, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 86, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z16amountOfSameBitsjj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %23

; <label>:23                                      ; preds = %22, %20
  store i32 0, i32* %i, align 4
  br label %24

; <label>:24                                      ; preds = %40, %23
  %25 = load i32* %i, align 4
  %26 = load i32* %2, align 4
  %27 = icmp ult i32 %25, %26
  br i1 %27, label %28, label %43

; <label>:28                                      ; preds = %24
  %29 = load i32* %workNum, align 4
  %30 = and i32 %29, 1
  %31 = load i32* %firstBit, align 4
  %32 = icmp eq i32 %30, %31
  br i1 %32, label %33, label %38

; <label>:33                                      ; preds = %28
  %34 = load i32* %length, align 4
  %35 = add i32 %34, 1
  store i32 %35, i32* %length, align 4
  %36 = load i32* %workNum, align 4
  %37 = lshr i32 %36, 1
  store i32 %37, i32* %workNum, align 4
  br label %39

; <label>:38                                      ; preds = %28
  br label %43

; <label>:39                                      ; preds = %33
  br label %40

; <label>:40                                      ; preds = %39
  %41 = load i32* %i, align 4
  %42 = add i32 %41, 1
  store i32 %42, i32* %i, align 4
  br label %24

; <label>:43                                      ; preds = %38, %24
  %44 = load i32* %length, align 4
  %45 = load i32* %2, align 4
  %46 = icmp ule i32 %44, %45
  br i1 %46, label %47, label %48

; <label>:47                                      ; preds = %43
  br label %50

; <label>:48                                      ; preds = %43
  call void @__assert_fail(i8* getelementptr inbounds ([20 x i8]* @.str74, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 95, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z16amountOfSameBitsjj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %50

; <label>:50                                      ; preds = %49, %47
  %51 = load i32* %length, align 4
  ret i32 %51
}

attributes #0 = { "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #1 = { nounwind }
attributes #2 = { noreturn nounwind "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #3 = { nounwind "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #4 = { noreturn nounwind }

!llvm.ident = !{!0}

!0 = metadata !{metadata !"Ubuntu clang version 3.4-1ubuntu3 (tags/RELEASE_34/final) (based on LLVM 3.4)"}
