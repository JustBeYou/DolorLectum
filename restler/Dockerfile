FROM mcr.microsoft.com/restlerfuzzer/restler:v7.4.0

VOLUME /target

COPY fuzz.sh .
RUN chmod +x fuzz.sh

VOLUME [ "/results" ]
RUN mkdir -p /results
CMD ["./fuzz.sh"]