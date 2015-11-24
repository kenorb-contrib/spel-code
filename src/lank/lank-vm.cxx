extern "C" {
/* Hello World program */

#include<assert.h>
#include<stdio.h>
#include<stdlib.h>
#include<stdbool.h>
#define SIZEOF_ARRAY( arr ) sizeof( arr ) / sizeof( arr[0] )
#define MAX_INSTRUCTION_VALUE 0xFFFFFFFFU
#define MAX_ADDRESS_VALUE 0xFFFFU
#define BATCH_SIZE 0x10U
#define MAX_BATCH_IDX 0xFU

/* case registers */
#define NUM_REGS 0xA
#define IMM 0
#define SU 1
#define TIME 2
#define FROM 3
#define BY 4
#define TO 5
#define OB 6
#define BE 7
#define PC 9

/* words  */
#define SU_WORD 1
#define TIME 2
#define FROM_WORD 0x59
#define BY 4
#define TO_WORD 0x3A
#define OB_WORD 0x3C
#define BE_WORD 7
#define ADD_WORD 0xC13A
#define SUB_WORD 0xC854
#define EXIT_WORD 0xA291
#define ZERO_WORD 0x9B58

/* type numbers  */
#define NU 0xA

static void error(const char *message) {
    fprintf(stderr,"%s\n",message);
    exit(EXIT_FAILURE);
}

/** amount of same bits
    returns how many bits are the same from smallest to largest
    up to the limit of maxLength
*/
static unsigned int amountOfSameBits(const unsigned int number,
        const unsigned int maxLength) {
    unsigned int length = 0;
    unsigned int i;
    unsigned int firstBit;
    unsigned int workNum = number;
    assert (number < MAX_INSTRUCTION_VALUE);
    assert (maxLength <= (unsigned int) sizeof(int)*8); 
    firstBit = workNum & 1U;
    assert (firstBit <= 1);
    for (i=0; i < maxLength; i++) {
        if ((workNum & 1U) == firstBit) {
            length++;
            workNum = workNum >> 1;
        } else {
            break;
        }
    }
    assert (length <= maxLength); 
    return length;
}

/** fetch
    assumes prog is split into batches of 256bits. 
 each batch starts with a short int index that describes the
 instruction layout by alternating 1's and 0's for different
 phrases. 
    based on this index and the pc register it copies those
bytes to the instruction array, leaving the rest of it blank.
 */ 
static void fetch(const unsigned int *prog, 
        const unsigned int progLength, 
        unsigned int *pc, unsigned int *instruction, 
        unsigned int *instructionLength){
    unsigned int batchIndex = 0;
    unsigned int currentBit = 0;
    unsigned int instructionWord = 0;
    unsigned int maxLength = BATCH_SIZE;
    unsigned int i;
    unsigned int remainingLength = 0;
    /* Program Counter must be defined and valid*/
    assert(pc != NULL );
    if (*pc >= progLength) {
        error("PC exceeded end of program");
    }
    assert(*pc < progLength);
    batchIndex = prog[*pc&(MAX_ADDRESS_VALUE-MAX_BATCH_IDX)]; 
    currentBit = *pc&((~MAX_ADDRESS_VALUE)+MAX_BATCH_IDX);
    /* skip index */
    if (currentBit == 0) {
        *pc = *pc+1;
        currentBit++;
    }
    assert (currentBit < BATCH_SIZE);
    batchIndex = batchIndex >> currentBit;
    remainingLength =  progLength-*pc;
    if (remainingLength < BATCH_SIZE) {
       maxLength = (progLength%MAX_BATCH_IDX)-currentBit; 
    } else {
        maxLength = BATCH_SIZE-currentBit;
    }
    assert (maxLength <= BATCH_SIZE);
    *instructionLength = amountOfSameBits(batchIndex, maxLength);
    assert (*instructionLength <= remainingLength);
    assert (*instructionLength <= maxLength);
    for (i=0;i<*instructionLength;i++){
        *pc = *pc+1 ;
        instructionWord =  prog[*pc-1];
        assert (instructionWord <= MAX_INSTRUCTION_VALUE); 
        instruction[i] = instructionWord;
    }
    /* fill rest with blanks */
    /*
    for (i=*instructionLength;i<BATCH_SIZE;i++) {
        instruction[i] = 0;
    }*/
}

static char nibbleToLankGlyph(const unsigned int nibble){
    char result;
    assert(nibble <= 0xF );
    switch (nibble){
        case 0: result = 'm'; break;
        case 1: result = 'k'; break;
        case 2: result = 'i'; break;
        case 3: result = 'a'; break;
        case 4: result = 'y'; break;
        case 5: result = 'u'; break;
        case 6: result = 'p'; break;
        case 7: result = 'w'; break;
        case 8: result = 'n'; break;
        case 9: result = 's'; break;
        case 0xA: result = 't'; break;
        case 0xB: result = 'l'; break;
        case 0xC: result = 'h'; break;
        case 0xD: result = 'f'; break;
        case 0xE: result = '.'; break;
        case 0xF: result = 'c'; break;
        default: result = 'X'; break;
    }
    assert(result >= '.' && result <='z' );
    return result;
}


static void EightNibblesToLankGlyphs(
        const unsigned int instruction, char *result){
    unsigned int nibbles[8];
    assert( instruction <= MAX_INSTRUCTION_VALUE);
    assert( result != NULL ); /*char array result*/
    result[8] = (char) 0; /* make null terminated string */
    nibbles[0] =  instruction & 0x0000000F;
    nibbles[1] = (instruction & 0x000000F0 )>> 0x4;
    nibbles[2] = (instruction & 0x00000F00 )>> 0x8;
    nibbles[3] = (instruction & 0x0000F000 )>> 0xC;
    nibbles[4] = (instruction & 0x000F0000 )>> 0x10;
    nibbles[5] = (instruction & 0x00F00000 )>> 0x14;
    nibbles[6] = (instruction & 0x0F000000 )>> 0x18;
    nibbles[7] = (instruction & 0xF0000000 )>> 0x1C;
    result[0] = nibbleToLankGlyph(nibbles[0]);
    result[1] = nibbleToLankGlyph(nibbles[1]);
    result[2] = nibbleToLankGlyph(nibbles[2]);
    result[3] = nibbleToLankGlyph(nibbles[3]);
    result[4] = nibbleToLankGlyph(nibbles[4]);
    result[5] = nibbleToLankGlyph(nibbles[5]);
    result[6] = nibbleToLankGlyph(nibbles[6]);
    result[7] = nibbleToLankGlyph(nibbles[7]);
}

/** whole instruction to glyph
returns char* of whole instruction
*/
static void wholeInstructionToGlyph(const unsigned int
        *instruction, const unsigned int instructionLength,
        char * glyphs) {
    unsigned int i = 0;
    assert (instruction != NULL);
    assert (glyphs != NULL);
    assert (instructionLength > 0);
    assert (instructionLength <= BATCH_SIZE);
    for (i = 0; i < instructionLength; i++) {
        EightNibblesToLankGlyphs(instruction[i], glyphs);
    }
    assert (sizeof(glyphs) > 0);
}

static void printRegs(const unsigned int *regs, 
        const unsigned short int *tregs) {
    assert(regs != NULL);
    assert(tregs != NULL);
    printf("registers: \n");
    printf("      Value\tType \n");
    printf(" IMM    %d\t0x%X,\n"    ,(int)regs[IMM ],tregs[IMM ]); 
    printf(" SU     %d\t0x%X,\n"    ,(int)regs[SU  ],tregs[SU  ]); 
    printf(" TIME   %d\t0x%X,\n"    ,(int)regs[TIME],tregs[TIME]);
    printf(" FROM   %d\t0x%X,\n"    ,(int)regs[FROM],tregs[FROM]);
    printf(" BY     %d\t0x%X,\n"    ,(int)regs[BY  ],tregs[BY  ]);
    printf(" TO     %d\t0x%X,\n"    ,(int)regs[TO  ],tregs[TO  ]);
    printf(" OB     %d\t0x%X,\n"    ,(int)regs[OB  ],tregs[OB  ]);
    printf(" BE     %d\t0x%X,\n"    ,(int)regs[BE  ],tregs[BE  ]);
    printf(" PC     %d\t0x%X,\n"    ,(int)regs[PC  ],tregs[PC  ]);
}

static void phraseDecode(const unsigned int phraseWord, 
    const unsigned short int typeWord, unsigned int *regs, 
    unsigned short int *tregs) {
    if (phraseWord != 0) {
        switch(phraseWord) {
            case OB_WORD: /*ha */
                regs[OB]= regs[IMM];
                tregs[OB]= typeWord;
                break;
            case TO_WORD: /*ta */
                regs[TO]= regs[IMM];
                tregs[TO]= typeWord;
                break;
            case FROM_WORD: /*su */
                regs[FROM]= regs[IMM];
                tregs[FROM]= typeWord;
                break;
            default:
                error("phraseDecode: unknown phraseWord");
                break;
        }
    }
}
/* decode algorithm:
   if starts with pfih, then identify how long,
    once identified set immediate value
    and extract command portion,
    match command portion to register,
    load register with immediate value.
*/
static void decode(const unsigned int *instruction, 
        const unsigned int instructionLength, 
        unsigned int *regs, unsigned short int *tregs){
    unsigned int immediateValue = 0;
    unsigned int immediateLengthWord = 0;
    unsigned int phraseWord = 0;
    unsigned short int typeWord = 0;
    if ((instruction[0] & 0x0000C2D6U) == 0x0000C2D6U) {
        assert(instructionLength > 1);
        immediateLengthWord = (instruction[0] & 0xFFFF0000U) >> 
            0x10;
        assert(immediateLengthWord > 0);
        assert(0xFFFF >= immediateLengthWord);
        switch(immediateLengthWord) {
            case ZERO_WORD:
                immediateValue = instruction[1] & 0x0000FFFFU;
                assert (immediateValue <= MAX_INSTRUCTION_VALUE);
                regs[IMM]= immediateValue;   
                phraseWord = (instruction[1] & 0xFF000000U) >> 
                    0x18;
                typeWord = (unsigned short int) 
                    ((instruction[1] & 0x00FF0000U) >> 0x10);
                break;
            default: 
                error("decode: unknown immediateLengthWord");
                break;
        }
    }
    phraseDecode(phraseWord,typeWord,regs,tregs);
}


static void eval(const unsigned int *instruction, 
        const unsigned int instructionLength, 
        unsigned int *regs, unsigned short int *tregs, 
        bool *running) {
    unsigned int command;
    if ((instruction[0] & 0x342C0000U) == 0x342C0000U) {
        /* can add compound verbs later */
        assert(instructionLength == 1); /*single verbs for now*/
        command = instruction[0] & 0x0000FFFFU;
        assert(command != 0);
        switch(command) {
            case EXIT_WORD: /*ksit exit*/
                printf("exit\n"); 
                *running = false;
                break;
            case ADD_WORD: /*takh add*/
                assert (tregs[TO] == tregs[OB]);
                regs[TO] = regs[TO] + regs[OB] + regs [FROM];
                printf("added\n");
                printRegs(regs,tregs);
                break;
            case SUB_WORD: /*yunh sub*/
                assert (tregs[FROM] == tregs[OB]);
                regs[TO] = regs[FROM] - regs[OB];
                printf("subtracted\n");
                printRegs(regs,tregs);
                break;
            default:
                error("eval: unknown command");
                break;
        }
    }
}

static void run(const unsigned int *prog, 
        const unsigned int progLength) {
    unsigned int regs[ NUM_REGS ];
    unsigned short int tregs[ NUM_REGS ];
    unsigned int *pc;
    unsigned int instruction[BATCH_SIZE];
    unsigned int instructionLength = 0;
    unsigned int i = 0;
    bool running = true;
    char glyphs[9] = "X";
    instruction[0]=0; /* set initial value */
    /* initialize registers */
    tregs[IMM] = 0;
    tregs[SU] = 0;
    tregs[TIME] = 0;
    tregs[BY] = 0;
    tregs[TO] = 0;
    tregs[OB] = 0;
    tregs[BE] = 0;
    tregs[PC] = 0;
    regs[IMM] = 0;
    regs[SU] = 0;
    regs[TIME] = 0;
    regs[BY] = 0;
    regs[TO] = 0;
    regs[OB] = 0;
    regs[BE] = 0;
    regs[PC] = 0;
    pc = regs+PC; /* program counter */
    /* fetch instructions */
    for (i = 0; i < progLength; i++) {
        fetch(prog, progLength, pc, instruction, 
            &instructionLength);
        decode(instruction,instructionLength,regs,tregs);
        assert(instruction[0] <= MAX_INSTRUCTION_VALUE); 
        printf("PC %X INSTR %X\n",*pc,instruction[0]);
        wholeInstructionToGlyph(instruction, instructionLength,
            glyphs);
        printf("%s\n",glyphs);
        eval(instruction,instructionLength,regs,tregs,&running);
        if (running == false) {
            break;
        }
    }
}

int main()
{
   unsigned int prog[] = { 0x126, 0x9B58C2D6U, 0x3C380064U,
           0x9B58C2D6U, 0x3A3800C8U, 
           0x342CC13AU,
           0x9B58C2D6U, 0x593800D8U, 
           0x342CC854U,
           0x342CA291U
        }; 
    unsigned int progLength = 0xA;
    assert(progLength > 0);
/* pfihnuls mmpynaha pfihnuls mmhnnata takhhiya
    cwahhiya */
    run(prog, progLength);
    /* exit */
    return 0;
}
}
