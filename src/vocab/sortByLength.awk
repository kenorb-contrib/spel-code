BEGIN {
    IGNORECASE=1
}

{
    for(i=1;i<=NF;i++) {
        a[length($i)][$i]++
    }
}

END {

    for (i in a) {
        b[x++] = i + 0
    }

    n = asort(b)

    for (j=1;j<=n;j++) {

        m = asorti(a[b[j]],c)

        for (k=1;k<=m;k++) {

            for (l=1;l<=a[b[j]][c[k]];l++) {
                r = (r ? r FS : "") c[k]
            }

            s = (s ? s FS : "\n") r
            r = ""
        }

        print s
        s = ""
    }
}
